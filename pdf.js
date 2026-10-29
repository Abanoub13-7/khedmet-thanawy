/* خدمة ثانوي — مولّد PDF للتوزيعة (بدون مكتبات خارجية)
   - تشكيل الحروف العربية + ترتيب الاتجاهات (Bidi) داخل الكود
   - خط DejaVu Sans مُضمَّن (مجموعة جزئية) + نص حقيقي قابل للتحديد والنسخ (ActualText)
   - ملف PDF حقيقي A4 (وليس صورة) + معاينة بنفس بيانات التخطيط على Canvas */
(function (root) {
  'use strict';
  const A = PDF_ASSETS;
  const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN_X = 36, MARGIN_TOP = 34, MARGIN_BOTTOM = 46;
  const COLORS = {
    navy: '#072A58', navy2: '#12407F', gold: '#C8962E', goldDark: '#8A6212', goldSoft: '#F3E6C4',
    tint: '#EEF2F9', tintLine: '#CBD5E8', rowAlt: '#F3F6FB', text: '#1B2433', muted: '#5C677A',
    line: '#D3DAE6', red: '#B03A2E', green: '#1E7B4F', amber: '#9A6A12', white: '#FFFFFF'
  };
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  /* ---------- أدوات عامة ---------- */
  function b64ToBytes(b64) { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function fmtNum(n) { return (Math.round(n * 100) / 100).toString(); }
  function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255].map(fmtNum).join(' '); }
  function ymdParts(s) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); if (!m) return null; const y = +m[1], mo = +m[2], d = +m[3]; const dt = new Date(y, mo - 1, d); if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null; return { y, mo, d, wd: dt.getDay() }; }
  function dateLongAr(s) { const p = ymdParts(s); return p ? `${p.d} ${MONTHS[p.mo - 1]} ${p.y}` : ''; }
  function weekdayAr(s) { const p = ymdParts(s); return p ? WEEKDAYS[p.wd] : ''; }
  function time12(t) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); if (!m) return '';
    let h = +m[1]; const mi = m[2]; const suf = h >= 12 ? 'م' : 'ص'; h = h % 12; if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${mi} ${suf}`;
  }
  function sanitizeFileName(s) { return String(s || '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80); }
  function pdfFileName(name, date) {
    const nm = (name || '').trim();
    const mid = (!nm || nm === 'اجتماع الخدمة') ? 'خدمة الاجتماع' : sanitizeFileName(nm);
    return `توزيعة ${mid} - ${date}.pdf`;
  }

  /* ---------- الخطوط والتشكيل ---------- */
  const FONTS = {}; ['reg', 'bold'].forEach(k => {
    const f = A.fonts[k]; FONTS[k] = { key: k, info: f, cmap: f.cmap, adv: f.adv, used: new Set() };
  });
  const FORMS = A.forms, LIG = A.lig;
  const U2 = {}; // gid -> نص يونيكود (للنسخ)
  function reverseMaps() {
    ['reg', 'bold'].forEach(k => {
      const f = FONTS[k]; f.g2u = {};
      for (const cp in f.cmap) {
        const gid = f.cmap[cp], c = +cp; let u = String.fromCodePoint(c);
        if (c >= 0xFE70 && c <= 0xFEFF) {
          for (const b in FORMS) if (FORMS[b].includes(c)) { u = String.fromCodePoint(+b); break; }
          for (const b in LIG) if (LIG[b].includes(c)) { u = String.fromCodePoint(+b) + 'ل'; break; }
        }
        if (!(gid in f.g2u)) f.g2u[gid] = u;
      }
    });
  }
  reverseMaps();

  const isMark = c => (c >= 0x64B && c <= 0x65F) || c === 0x670 || (c >= 0x6D6 && c <= 0x6DC) || (c >= 0x6DF && c <= 0x6E4) || c === 0x6E7 || c === 0x6E8 || (c >= 0x6EA && c <= 0x6ED);
  function cleanCps(str) {
    const out = [];
    for (const ch of String(str == null ? '' : str)) {
      let c = ch.codePointAt(0);
      if (isMark(c) || c === 0x640 || c === 0x200B || c === 0x200C || c === 0x200D || c === 0x200E || c === 0x200F || (c >= 0x202A && c <= 0x202E) || c === 0xFEFF) continue;
      if (c === 0xA0 || c === 9 || c === 0x2009 || c === 0x202F) c = 0x20;
      if (c < 0x20) continue;
      out.push(c);
    }
    return out;
  }
  function btype(c) {
    if ((c >= 0x30 && c <= 0x39) || (c >= 0x660 && c <= 0x669) || (c >= 0x6F0 && c <= 0x6F9)) return 'EN';
    if ((c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A) || (c >= 0xC0 && c <= 0x24F && c !== 0xD7 && c !== 0xF7)) return 'L';
    if (c >= 0x600 && c <= 0x6FF) { if (c === 0x60C || c === 0x61B || c === 0x61F || c === 0x66A || c === 0x66B || c === 0x66C || c === 0x6D4) return 'N'; return 'AR'; }
    if ((c >= 0xFB50 && c <= 0xFDFF) || (c >= 0xFE70 && c <= 0xFEFF)) return 'AR';
    if (c === 0x2B || c === 0x2D) return 'ES';
    if (c === 0x2C || c === 0x2E || c === 0x2F || c === 0x3A) return 'CS';
    return 'N';
  }
  const joinType = c => { const f = FORMS[c]; if (!f) return 'U'; return f[2] ? 'D' : 'R'; };
  const MIRROR = { 0x28: 0x29, 0x29: 0x28, 0x5B: 0x5D, 0x5D: 0x5B, 0x7B: 0x7D, 0x7D: 0x7B, 0x3C: 0x3E, 0x3E: 0x3C, 0xAB: 0xBB, 0xBB: 0xAB };

  /* تشكيل المنطق (بالترتيب المنطقي) ثم تحديد المستويات */
  function shapeLogical(cps) {
    const types = cps.map(btype);
    for (let i = 1; i < cps.length - 1; i++) if ((types[i] === 'ES' || types[i] === 'CS') && types[i - 1] === 'EN' && types[i + 1] === 'EN') types[i] = 'EN';
    // مستويات
    const lv = new Array(cps.length).fill(1);
    for (let i = 0; i < cps.length; i++) {
      const t = types[i];
      if (t === 'AR') lv[i] = 1; else if (t === 'EN' || t === 'L') lv[i] = 2;
    }
    for (let i = 0; i < cps.length;) {
      const t = types[i];
      if (t === 'AR' || t === 'EN' || t === 'L') { i++; continue; }
      let j = i; while (j < cps.length && !['AR', 'EN', 'L'].includes(types[j])) j++;
      const left = i === 0 ? 'R' : (types[i - 1] === 'L' ? 'L' : 'R');
      const right = j >= cps.length ? 'R' : (types[j] === 'L' ? 'L' : 'R');
      const level = (left === 'L' && right === 'L') ? 2 : 1;
      for (let k = i; k < j; k++) lv[k] = level;
      i = j;
    }
    // تشكيل الحروف
    const items = [];
    for (let i = 0; i < cps.length; i++) {
      const c = cps[i];
      if (types[i] !== 'AR' || !FORMS[c]) { items.push({ cp: c, lvl: lv[i], li: items.length }); continue; }
      const prev = i > 0 ? cps[i - 1] : 0, next = i + 1 < cps.length ? cps[i + 1] : 0;
      const prevJoin = prev && types[i - 1] === 'AR' && joinType(prev) === 'D' && !(items.length && items[items.length - 1].noJoinNext);
      if (c === 0x644 && LIG[next] && types[i + 1] === 'AR') {
        const L = LIG[next]; items.push({ cp: prevJoin ? L[1] : L[0], lvl: lv[i], noJoinNext: true, li: items.length }); i++; continue;
      }
      const f = FORMS[c], nextJoin = next && types[i + 1] === 'AR' && (joinType(next) === 'D' || joinType(next) === 'R');
      let cp;
      if (joinType(c) === 'D') cp = prevJoin && nextJoin ? f[3] : prevJoin ? f[1] : nextJoin ? f[2] : f[0];
      else cp = prevJoin ? f[1] : f[0];
      items.push({ cp: cp || c, lvl: lv[i], li: items.length });
    }
    return items;
  }
  function reorder(items) {
    let max = 0; items.forEach(it => { if (it.lvl > max) max = it.lvl; });
    const arr = items.slice();
    for (let level = max; level >= 1; level--) {
      for (let i = 0; i < arr.length;) {
        if (arr[i].lvl >= level) { let j = i; while (j < arr.length && arr[j].lvl >= level) j++; const seg = arr.slice(i, j).reverse(); for (let k = i; k < j; k++) arr[k] = seg[k - i]; i = j; } else i++;
      }
    }
    return arr.map(it => (it.lvl % 2 === 1 && MIRROR[it.cp]) ? { ...it, cp: MIRROR[it.cp] } : it);
  }
  function glyphOf(font, cp) {
    let gid = font.cmap[cp]; if (gid === undefined) { if (cp === 0x20) return null; return null; } return gid;
  }
  /* سطر واحد -> قائمة glyphs بترتيب العرض + العرض الكلي (وحدات 1/1000 em) */
  function shapeLine(str, fontKey) {
    const font = FONTS[fontKey]; const vis = reorder(shapeLogical(cleanCps(str)));
    const glyphs = []; let w = 0;
    for (const it of vis) {
      const gid = glyphOf(font, it.cp); if (gid === undefined || gid === null) continue;
      const adv = font.adv[gid] != null ? font.adv[gid] : 600; glyphs.push({ gid, cp: it.cp, adv, li: it.li }); w += adv;
    }
    return { glyphs, w };
  }
  function measure(str, fontKey, size) {
    const font = FONTS[fontKey]; let w = 0;
    for (const it of shapeLogical(cleanCps(str))) { const gid = font.cmap[it.cp]; if (gid !== undefined) w += font.adv[gid] != null ? font.adv[gid] : 600; }
    return w * size / 1000;
  }
  /* التفاف النص حسب العرض (بالترتيب المنطقي) */
  function wrapText(text, fontKey, size, maxW) {
    const out = [];
    String(text == null ? '' : text).split(/\r?\n/).forEach(par => {
      const words = par.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      let line = '';
      const flush = () => { if (line) out.push(line); line = ''; };
      for (const w of words) {
        const tryLine = line ? line + ' ' + w : w;
        if (measure(tryLine, fontKey, size) <= maxW) { line = tryLine; continue; }
        flush();
        if (measure(w, fontKey, size) <= maxW) { line = w; continue; }
        // كلمة أطول من الخلية: تقطيع بالحروف
        let chunk = '';
        for (const ch of w) { if (measure(chunk + ch, fontKey, size) > maxW && chunk) { out.push(chunk); chunk = ch; } else chunk += ch; }
        line = chunk;
      }
      flush();
    });
    return out.length ? out : [''];
  }

  /* ---------- التخطيط (قائمة عناصر لكل صفحة) ---------- */
  function newPage() { return { bg: [], fg: [] }; }
  function addText(page, str, o) {
    const fk = o.font || 'reg', size = o.size || 11;
    if (!String(str).trim()) return 0;
    const sh = shapeLine(str, fk), width = sh.w * size / 1000;
    let x;
    if (o.align === 'left') x = o.x; else if (o.align === 'center') x = o.x - width / 2; else x = o.x - width; // الافتراضي: يمين
    let cx = x; const glyphs = sh.glyphs.map(g => { const r = { gid: g.gid, cp: g.cp, x: cx, li: g.li }; cx += g.adv * size / 1000; return r; });
    glyphs.forEach(g => FONTS[fk].used.add(g.gid));
    page.fg.push({ t: 'text', glyphs, y: o.y, size, font: fk, color: o.color || COLORS.text, actual: String(str) });
    return width;
  }
  const rect = (arr, x, y, w, h, fill, stroke, lw) => arr.push({ t: 'rect', x, y, w, h, fill, stroke, lw });
  const hline = (arr, x1, y, x2, color, w) => arr.push({ t: 'line', x1, y1: y, x2, y2: y, color, w });

  function buildLayout(plan) {
    const pages = []; let page = newPage(); pages.push(page);
    const R = PAGE_W - MARGIN_X, L = MARGIN_X, CW = PAGE_W - 2 * MARGIN_X;
    const segs = plan.segments || [];
    const unassigned = segs.filter(s => !s.servant);
    const served = new Set(segs.filter(s => s.servant).map(s => s.servant.trim())).size;

    /* ترويسة الصفحة الأولى */
    const logoW = 66, logoH = logoW * A.logo.h / A.logo.w, top = MARGIN_TOP;
    page.fg.push({ t: 'img', name: 'Logo', x: R - logoW, y: top, w: logoW, h: logoH });
    const tx = R - logoW - 14;
    addText(page, 'خدمة ثانوي', { x: tx, y: top + 30, size: 26, font: 'bold', color: COLORS.navy });
    addText(page, 'كنيسة الملكة والأنبا إبرام بالتحدي', { x: tx, y: top + 50, size: 11.5, color: COLORS.goldDark });
    addText(page, 'توزيعة فقرات الاجتماع والخدام', { x: tx, y: top + 67, size: 10, color: COLORS.muted });
    let y = top + logoH + 8;
    rect(page.fg, L, y, CW, 2.2, COLORS.gold); rect(page.fg, L, y + 3.6, CW, 0.7, COLORS.navy);
    y += 20;

    /* عنوان الاجتماع */
    const mid = PAGE_W / 2;
    addText(page, 'توزيعة الاجتماع', { x: mid, y: y + 8, size: 10.5, color: COLORS.goldDark, align: 'center' }); y += 12;
    const nameLines = wrapText(plan.name || 'اجتماع الخدمة', 'bold', 20, CW - 20);
    nameLines.forEach(l => { addText(page, l, { x: mid, y: y + 20, size: 20, font: 'bold', color: COLORS.navy, align: 'center' }); y += 28; });
    const dateLine = `${plan.weekday || ''} ${plan.dateText || ''}`.trim();
    addText(page, dateLine, { x: mid, y: y + 12, size: 13, font: 'bold', color: COLORS.text, align: 'center' }); y += 20;
    const tm = plan.start && plan.end ? `من الساعة ${time12(plan.start)} إلى الساعة ${time12(plan.end)}` : plan.start ? `يبدأ الساعة ${time12(plan.start)}` : plan.end ? `ينتهي الساعة ${time12(plan.end)}` : '';
    if (tm) { addText(page, tm, { x: mid, y: y + 10, size: 11, color: COLORS.muted, align: 'center' }); y += 18; }
    y += 8;

    /* صندوق الإحصاءات */
    const gap = 10, bw = (CW - 2 * gap) / 3, bh = 46;
    const complete = unassigned.length === 0 && segs.length > 0;
    const stats = [
      { label: 'عدد الفقرات', value: String(segs.length), color: COLORS.navy },
      { label: 'عدد الخدام المشاركين', value: String(served), color: COLORS.navy },
      { label: 'حالة التوزيعة', value: complete ? 'مكتملة' : (segs.length ? `ناقصة (${unassigned.length} بلا خادم)` : 'لا توجد فقرات'), color: complete ? COLORS.green : COLORS.red }
    ];
    stats.forEach((s, i) => {
      const bx = R - (i + 1) * bw - i * gap;
      rect(page.bg, bx, y, bw, bh, COLORS.tint, COLORS.tintLine, 0.7);
      rect(page.fg, bx + bw - 3, y, 3, bh, COLORS.gold);
      addText(page, s.label, { x: bx + bw - 12, y: y + 17, size: 9.5, color: COLORS.muted });
      addText(page, s.value, { x: bx + bw - 12, y: y + 36, size: 12.5, font: 'bold', color: s.color });
    });
    y += bh + 16;

    /* الجدول */
    const cols = [{ k: 'n', title: 'م', w: 30 }, { k: 'title', title: 'الفقرة', w: 118 }, { k: 'servant', title: 'الخادم المسؤول', w: 128 }, { k: 'time', title: 'الوقت أو المدة', w: 112 }];
    cols.push({ k: 'notes', title: 'ملاحظات', w: CW - cols.reduce((a, c) => a + c.w, 0) });
    let cx = R; cols.forEach(c => { c.xr = cx; c.xl = cx - c.w; cx -= c.w; });
    const PAD = 6, FS = 11, LEAD = 17.5, HEAD_H = 28;
    const bottomLimit = PAGE_H - MARGIN_BOTTOM;
    function compactHeader(pg) {
      const lw = 30, lh = lw * A.logo.h / A.logo.w;
      pg.fg.push({ t: 'img', name: 'Logo', x: R - lw, y: MARGIN_TOP - 4, w: lw, h: lh });
      addText(pg, 'خدمة ثانوي', { x: R - lw - 8, y: MARGIN_TOP + 14, size: 14, font: 'bold', color: COLORS.navy });
      addText(pg, `${plan.name || ''} — ${plan.weekday || ''} ${plan.dateText || ''}`, { x: R - lw - 8, y: MARGIN_TOP + 29, size: 9.5, color: COLORS.muted });
      const yy = MARGIN_TOP + lh + 2; rect(pg.fg, L, yy, CW, 1.6, COLORS.gold); return yy + 14;
    }
    function drawHead(pg, yy) {
      rect(pg.bg, L, yy, CW, HEAD_H, COLORS.navy);
      cols.forEach(c => addText(pg, c.title, { x: c.xr - c.w / 2, y: yy + 18.5, size: 11, font: 'bold', color: COLORS.white, align: 'center' }));
      return yy + HEAD_H;
    }
    function newPageWithHead() { page = newPage(); pages.push(page); let yy = compactHeader(page); return drawHead(page, yy); }
    y = drawHead(page, y);

    if (!segs.length) {
      rect(page.fg, L, y, CW, 40, null, COLORS.line, 0.6);
      addText(page, 'لا توجد فقرات في هذا الاجتماع.', { x: mid, y: y + 25, size: 11, color: COLORS.muted, align: 'center' }); y += 40;
    }
    segs.forEach((s, i) => {
      const timeTxt = s.start && s.end ? `من ${time12(s.start)} إلى ${time12(s.end)}` : s.start ? `من ${time12(s.start)}` : s.end ? `حتى ${time12(s.end)}` : (s.duration ? `${s.duration} دقيقة` : '—');
      const cells = {
        n: [String(i + 1)], title: wrapText(s.title || '—', 'bold', FS, cols[1].w - 2 * PAD),
        servant: s.servant ? wrapText(s.servant + (s.servantNote ? ` (${s.servantNote})` : ''), 'reg', FS, cols[2].w - 2 * PAD) : ['لم يُحدَّد الخادم بعد'],
        time: wrapText(timeTxt, 'reg', 10.5, cols[3].w - 2 * PAD), notes: wrapText(s.notes || '—', 'reg', 10.5, cols[4].w - 2 * PAD)
      };
      const nLines = Math.max(1, ...Object.values(cells).map(a => a.length));
      const rowH = Math.max(30, nLines * LEAD + 2 * 6);
      if (y + rowH > bottomLimit) y = newPageWithHead();
      if (i % 2 === 1) rect(page.bg, L, y, CW, rowH, COLORS.rowAlt);
      if (!s.servant) rect(page.bg, L, y, CW, rowH, '#FDF1EE');
      hline(page.fg, L, y + rowH, R, COLORS.line, 0.6);
      cols.forEach(c => {
        const lines = cells[c.k]; const blockH = lines.length * LEAD; let ly = y + (rowH - blockH) / 2;
        const fk = c.k === 'title' ? 'bold' : 'reg', size = (c.k === 'time' || c.k === 'notes') ? 10.5 : FS;
        const color = c.k === 'servant' && !s.servant ? COLORS.red : (c.k === 'title' ? COLORS.navy : (c.k === 'notes' || c.k === 'time') ? COLORS.text : COLORS.text);
        const center = c.k === 'n' || c.k === 'time';
        lines.forEach(l => { addText(page, l, { x: center ? c.xr - c.w / 2 : c.xr - PAD, y: ly + LEAD / 2 + size * 0.33, size, font: fk, color, align: center ? 'center' : 'right' }); ly += LEAD; });
      });
      // خطوط عمودية خفيفة
      cols.slice(0, -1).forEach(c => page.fg.push({ t: 'line', x1: c.xl, y1: y, x2: c.xl, y2: y + rowH, color: COLORS.line, w: 0.5 }));
      page.fg.push({ t: 'line', x1: R, y1: y, x2: R, y2: y + rowH, color: COLORS.line, w: 0.5 });
      page.fg.push({ t: 'line', x1: L, y1: y, x2: L, y2: y + rowH, color: COLORS.line, w: 0.5 });
      y += rowH;
    });
    rect(page.fg, L, y, CW, 1.4, COLORS.navy);
    y += 14;

    /* الملاحظات العامة (تُخفى إن كانت فارغة) */
    const notes = (plan.notes || '').trim();
    if (notes) {
      const lines = wrapText(notes, 'reg', 11, CW - 24);
      const NL = 18;
      let idx = 0;
      const title = (pg, yy) => { addText(pg, 'ملاحظات عامة', { x: R - 12, y: yy + 16, size: 11.5, font: 'bold', color: COLORS.goldDark }); return yy + 24; };
      if (y + 24 + NL + 12 > bottomLimit) { page = newPage(); pages.push(page); y = compactHeader(page); }
      while (idx < lines.length) {
        const boxTop = y; let yy = idx === 0 ? title(page, y) : y + 8;
        const startIdx = idx;
        while (idx < lines.length && yy + NL + 10 <= bottomLimit) { addText(page, lines[idx], { x: R - 12, y: yy + 12.5, size: 11, color: COLORS.text }); yy += NL; idx++; }
        if (idx === startIdx) { page = newPage(); pages.push(page); y = compactHeader(page); continue; }
        yy += 8;
        rect(page.bg, L, boxTop, CW, yy - boxTop, '#FBF8EF', COLORS.goldSoft, 0.8);
        rect(page.fg, L + CW - 3, boxTop, 3, yy - boxTop, COLORS.gold);
        y = yy;
        if (idx < lines.length) { page = newPage(); pages.push(page); y = compactHeader(page); }
      }
    }

    /* التذييل */
    pages.forEach((pg, i) => {
      const fy = PAGE_H - 30;
      rect(pg.fg, L, fy - 14, CW, 0.8, COLORS.gold);
      addText(pg, 'خدمة ثانوي — كنيسة الملكة والأنبا إبرام بالتحدي', { x: R, y: fy + 2, size: 9, color: COLORS.muted });
      addText(pg, `صفحة ${i + 1} من ${pages.length}`, { x: L, y: fy + 2, size: 9, color: COLORS.muted, align: 'left' });
    });
    return { pages, plan };
  }

  /* ---------- كاتب PDF ---------- */
  class Out {
    constructor() { this.parts = []; this.len = 0; }
    push(x) { if (typeof x === 'string') { const u = new Uint8Array(x.length); for (let i = 0; i < x.length; i++) u[i] = x.charCodeAt(i) & 255; x = u; } this.parts.push(x); this.len += x.length; }
    bytes() { const r = new Uint8Array(this.len); let o = 0; this.parts.forEach(p => { r.set(p, o); o += p.length; }); return r; }
  }
  const hex4 = n => n.toString(16).toUpperCase().padStart(4, '0');
  function utf16hex(str) { let h = 'FEFF'; for (let i = 0; i < str.length; i++) h += hex4(str.charCodeAt(i)); return h; }
  function pdfEscape(s) { return String(s).replace(/[\\()]/g, '\\$&'); }

  function toPdfBytes(layout) {
    const objs = []; // {id, parts}
    const reserve = () => { objs.push(null); return objs.length; };
    const set = (id, body, stream) => { objs[id - 1] = { body, stream }; };
    const catalog = reserve(), pagesId = reserve(), info = reserve();
    // الخطوط
    const fontRefs = {};
    ['reg', 'bold'].forEach((k, idx) => {
      const f = FONTS[k], inf = f.info;
      const used = [...f.used].sort((a, b) => a - b); if (!used.includes(0)) used.unshift(0);
      const ff = reserve(), fd = reserve(), cid = reserve(), tu = reserve(), t0 = reserve();
      const tag = (idx ? 'KTBOLD' : 'KTREGL') + '+DejaVuSans' + (idx ? '-Bold' : '');
      set(ff, `<< /Length1 ${inf.len} /Filter /FlateDecode`, b64ToBytes(inf.z));
      set(fd, `<< /Type /FontDescriptor /FontName /${tag} /Flags 4 /FontBBox [${inf.bbox.join(' ')}] /ItalicAngle 0 /Ascent ${inf.asc} /Descent ${inf.desc} /CapHeight ${inf.cap} /StemV ${idx ? 160 : 90} /FontFile2 ${ff} 0 R >>`);
      const W = used.map(g => `${g} [${f.adv[g] != null ? f.adv[g] : 600}]`).join(' ');
      set(cid, `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /${tag} /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${fd} 0 R /CIDToGIDMap /Identity /DW 600 /W [${W}] >>`);
      let cm = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CMapName /Adobe-Identity-UCS def /CMapType 2 def 1 begincodespacerange <0000> <FFFF> endcodespacerange\n';
      const entries = used.filter(g => f.g2u[g] !== undefined);
      for (let i = 0; i < entries.length; i += 100) {
        const chunk = entries.slice(i, i + 100); cm += `${chunk.length} beginbfchar\n`;
        chunk.forEach(g => { cm += `<${hex4(g)}> <${[...f.g2u[g]].map(ch => { const c = ch.codePointAt(0); return c > 0xFFFF ? hex4(((c - 0x10000) >> 10) + 0xD800) + hex4(((c - 0x10000) & 1023) + 0xDC00) : hex4(c); }).join('')}>\n`; });
        cm += 'endbfchar\n';
      }
      cm += 'endcmap CMapName currentdict /CMap defineresource pop end end';
      set(tu, '<<', new TextEncoder().encode(cm));
      set(t0, `<< /Type /Font /Subtype /Type0 /BaseFont /${tag} /Encoding /Identity-H /DescendantFonts [${cid} 0 R] /ToUnicode ${tu} 0 R >>`);
      fontRefs[k] = t0;
    });
    // الصور
    const logoId = reserve(); set(logoId, `<< /Type /XObject /Subtype /Image /Width ${A.logo.w} /Height ${A.logo.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`, b64ToBytes(A.logo.jpg));
    const wmA = reserve(); set(wmA, `<< /Type /XObject /Subtype /Image /Width ${A.wm.w} /Height ${A.wm.h} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode`, b64ToBytes(A.wm.alphaZ));
    const wmId = reserve(); set(wmId, `<< /Type /XObject /Subtype /Image /Width ${A.wm.w} /Height ${A.wm.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /SMask ${wmA} 0 R`, b64ToBytes(A.wm.jpg));
    // الصفحات
    const pageIds = [];
    layout.pages.forEach(pg => {
      const pid = reserve(), cid = reserve(); pageIds.push(pid);
      const ops = [];
      const Y = y => fmtNum(PAGE_H - y);
      const emit = it => {
        if (it.t === 'rect') {
          if (it.fill) ops.push(`${hexRgb(it.fill)} rg ${fmtNum(it.x)} ${Y(it.y + it.h)} ${fmtNum(it.w)} ${fmtNum(it.h)} re f`);
          if (it.stroke) ops.push(`${hexRgb(it.stroke)} RG ${fmtNum(it.lw || 0.7)} w ${fmtNum(it.x)} ${Y(it.y + it.h)} ${fmtNum(it.w)} ${fmtNum(it.h)} re S`);
        } else if (it.t === 'line') ops.push(`${hexRgb(it.color)} RG ${fmtNum(it.w)} w ${fmtNum(it.x1)} ${Y(it.y1)} m ${fmtNum(it.x2)} ${Y(it.y2)} l S`);
        else if (it.t === 'img') ops.push(`q ${fmtNum(it.w)} 0 0 ${fmtNum(it.h)} ${fmtNum(it.x)} ${Y(it.y + it.h)} cm /${it.name} Do Q`);
        else if (it.t === 'text') {
          const lg = it.glyphs.slice().sort((a, b) => a.li - b.li);
          ops.push(`BT ${hexRgb(it.color)} rg /${it.font === 'bold' ? 'F2' : 'F1'} ${fmtNum(it.size)} Tf`);
          lg.forEach(g => ops.push(`1 0 0 1 ${fmtNum(g.x)} ${Y(it.y)} Tm <${hex4(g.gid)}> Tj`));
          ops.push('ET');
        }
      };
      pg.bg.forEach(emit);
      const ww = 340, wh = ww * A.wm.h / A.wm.w; ops.push(`q ${fmtNum(ww)} 0 0 ${fmtNum(wh)} ${fmtNum((PAGE_W - ww) / 2)} ${fmtNum((PAGE_H - wh) / 2 - 10)} cm /WM Do Q`);
      pg.fg.forEach(emit);
      const content = new TextEncoder().encode(ops.join('\n'));
      set(cid, '<<', content);
      set(pid, `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${cid} 0 R /Resources << /Font << /F1 ${fontRefs.reg} 0 R /F2 ${fontRefs.bold} 0 R >> /XObject << /Logo ${logoId} 0 R /WM ${wmId} 0 R >> >> >>`);
    });
    const plan = layout.plan;
    set(pagesId, `<< /Type /Pages /Kids [${pageIds.map(i => i + ' 0 R').join(' ')}] /Count ${pageIds.length} >>`);
    set(catalog, `<< /Type /Catalog /Pages ${pagesId} 0 R /Lang (ar) /ViewerPreferences << /Direction /R2L /DisplayDocTitle true >> >>`);
    set(info, `<< /Title <${utf16hex(`توزيعة ${plan.name || ''} - ${plan.date || ''}`)}> /Author <${utf16hex('خدمة ثانوي')}> /Creator <${utf16hex('خدمة ثانوي')}> /Producer (Khedmet Thanawy) >>`);

    const out = new Out(); out.push('%PDF-1.7\n%\u00e2\u00e3\u00cf\u00d3\n'); const offsets = [];
    objs.forEach((o, i) => {
      offsets[i] = out.len; out.push(`${i + 1} 0 obj\n`);
      if (o.stream) { out.push(`${o.body.replace(/>>$/, '')}${o.body === '<<' ? '' : ' '}/Length ${o.stream.length} >>\nstream\n`); out.push(o.stream); out.push('\nendstream'); } else out.push(o.body);
      out.push('\nendobj\n');
    });
    const xref = out.len; out.push(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`);
    offsets.forEach(of => out.push(String(of).padStart(10, '0') + ' 00000 n \n'));
    out.push(`trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return out.bytes();
  }

  /* ---------- المعاينة والطباعة (Canvas) من نفس التخطيط ---------- */
  let fontsReady = null, wmCanvas = null, logoImg = null;
  async function inflate(bytes) { const ds = new DecompressionStream('deflate'); const s = new Blob([bytes]).stream().pipeThrough(ds); return new Uint8Array(await new Response(s).arrayBuffer()); }
  function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
  async function prepareCanvasAssets() {
    if (fontsReady) return fontsReady;
    fontsReady = (async () => {
      for (const [k, name] of [['reg', 'KhReg'], ['bold', 'KhBold']]) {
        const raw = await inflate(b64ToBytes(A.fonts[k].z));
        const ff = new FontFace(name, raw.buffer); await ff.load(); document.fonts.add(ff);
      }
      logoImg = await loadImage('data:image/jpeg;base64,' + A.logo.jpg);
      const base = await loadImage('data:image/jpeg;base64,' + A.wm.jpg);
      const c = document.createElement('canvas'); c.width = A.wm.w; c.height = A.wm.h; const cx = c.getContext('2d');
      cx.drawImage(base, 0, 0); const id = cx.getImageData(0, 0, c.width, c.height); const al = await inflate(b64ToBytes(A.wm.alphaZ));
      for (let i = 0; i < al.length; i++) id.data[i * 4 + 3] = al[i]; cx.putImageData(id, 0, 0); wmCanvas = c;
    })();
    return fontsReady;
  }
  async function renderCanvases(layout, scale) {
    await prepareCanvasAssets();
    return layout.pages.map(pg => {
      const c = document.createElement('canvas'); c.width = Math.round(PAGE_W * scale); c.height = Math.round(PAGE_H * scale);
      const ctx = c.getContext('2d'); ctx.scale(scale, scale); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, PAGE_W, PAGE_H);
      const draw = it => {
        if (it.t === 'rect') { if (it.fill) { ctx.fillStyle = it.fill; ctx.fillRect(it.x, it.y, it.w, it.h); } if (it.stroke) { ctx.strokeStyle = it.stroke; ctx.lineWidth = it.lw || 0.7; ctx.strokeRect(it.x, it.y, it.w, it.h); } }
        else if (it.t === 'line') { ctx.strokeStyle = it.color; ctx.lineWidth = it.w; ctx.beginPath(); ctx.moveTo(it.x1, it.y1); ctx.lineTo(it.x2, it.y2); ctx.stroke(); }
        else if (it.t === 'img') ctx.drawImage(logoImg, it.x, it.y, it.w, it.h);
        else if (it.t === 'text') { ctx.fillStyle = it.color; ctx.font = `${it.size}px ${it.font === 'bold' ? 'KhBold' : 'KhReg'}`; ctx.textBaseline = 'alphabetic'; it.glyphs.forEach(g => ctx.fillText(String.fromCodePoint(g.cp), g.x, it.y)); }
      };
      pg.bg.forEach(draw);
      const ww = 340, wh = ww * A.wm.h / A.wm.w; ctx.drawImage(wmCanvas, (PAGE_W - ww) / 2, (PAGE_H - wh) / 2 - 10, ww, wh);
      pg.fg.forEach(draw);
      return c;
    });
  }

  root.PlanPDF = { buildLayout, toPdfBytes, renderCanvases, pdfFileName, dateLongAr, weekdayAr, time12, PAGE_W, PAGE_H, COLORS, MONTHS, WEEKDAYS, _measure: measure, _shapeLine: shapeLine };
})(typeof window !== 'undefined' ? window : globalThis);
