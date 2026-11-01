/* خدمة ثانوي — طبقة الواجهة (v1.3)
   لا تحتوي منطق أعمال ولا تغيّر بنية البيانات. تقرأ db فقط، وتغلّف دوال العرض الموجودة
   (go / renderDashboard / renderReports) لإضافة العناوين والرسوم البيانية وحماية التغييرات غير المحفوظة. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const TITLES = {
    dashboard: 'الرئيسية', students: 'المخدومون', attendance: 'تسجيل الحضور', servants: 'إدارة الخدام',
    plans: 'توزيعة الاجتماعات', reports: 'التقارير', settings: 'الإعدادات'
  };
  const UI_KEY = 'kt-ui-sidebar'; // تفضيل واجهة فقط، منفصل تمامًا عن بيانات الخدمة
  const safe = fn => { try { return fn(); } catch (e) { return undefined; } };

  /* ---------- الشريط الجانبي القابل للطي ---------- */
  function setCollapsed(on, persist) {
    document.body.classList.toggle('sb-collapsed', on);
    const b = $('sidebarToggle');
    if (b) {
      b.setAttribute('aria-expanded', String(!on));
      b.title = on ? 'توسيع القائمة' : 'طي القائمة';
      const l = b.querySelector('.side-label'), i = b.querySelector('.side-ico');
      if (l) l.textContent = on ? 'توسيع القائمة' : 'طي القائمة';
      if (i) i.textContent = on ? '«' : '»';
    }
    if (persist) safe(() => localStorage.setItem(UI_KEY, on ? '1' : '0'));
  }
  setCollapsed(safe(() => localStorage.getItem(UI_KEY)) === '1', false);
  $('sidebarToggle').addEventListener('click', () => setCollapsed(!document.body.classList.contains('sb-collapsed'), true));
  $('sideBackupBtn').addEventListener('click', () => $('backupBtn').click());
  $('quickBackup').addEventListener('click', () => $('backupBtn').click());
  $('quickAddStudent').addEventListener('click', () => { go('students'); $('addStudentBtn').click(); });

  /* ---------- حماية التغييرات غير المحفوظة في الحضور ---------- */
  let dirty = false;
  function setDirty(v) { dirty = v; $('dirtyBadge').hidden = !v; }
  const CONFIRM_MSG = 'لديك تغييرات غير محفوظة في كشف الحضور. هل تريد تجاهلها؟';
  $('attendanceRoster').addEventListener('change', e => { if (e.target.matches('.status-select')) setDirty(true); });
  ['allPresentBtn', 'allAbsentBtn', 'clearStatusBtn'].forEach(id => $(id).addEventListener('click', () => setDirty(true)));
  $('meetingForm').addEventListener('submit', () => setDirty(false));
  const prev = {};
  ['meetingSelect', 'attendanceGrade', 'attendanceEducation'].forEach(id => {
    prev[id] = $(id).value;
    $(id).addEventListener('focus', () => { prev[id] = $(id).value; });
  });
  document.addEventListener('change', e => {
    const id = e.target && e.target.id;
    if (!(id in prev)) return;
    if (dirty && !confirm(CONFIRM_MSG)) { e.target.value = prev[id]; e.stopPropagation(); return; }
    setDirty(false); prev[id] = e.target.value;
  }, true);
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- التنقل: عنوان الصفحة + الحماية ---------- */
  const origGo = window.go;
  window.go = function (view) {
    if (dirty && activeView === 'attendance' && view !== 'attendance') {
      if (!confirm(CONFIRM_MSG)) return;
      setDirty(false);
    }
    origGo.apply(this, arguments);
    const t = $('pageTitle'); if (t) t.textContent = TITLES[view] || '';
    if (view === 'settings') renderStorageInfo();
  };
  // رسم تقرير/لوحة بعد أي تغيير بيانات (refreshAll يستدعيهما بالاسم)
  const origDash = window.renderDashboard;
  window.renderDashboard = function () { origDash.apply(this, arguments); safe(extraDashboard); };
  const origRep = window.renderReports;
  window.renderReports = function () { origRep.apply(this, arguments); safe(extraReports); };

  /* ---------- حسابات (نفس معادلة التطبيق: حاضر ÷ (حاضر + غائب)) ---------- */
  function tally(entries) {
    const p = entries.filter(a => a.status === 'present').length;
    const a = entries.filter(x => x.status === 'absent').length;
    return { p, a, c: p + a, rate: p + a ? Math.round(p / (p + a) * 100) : null };
  }
  function meetingPoints(entries, meetings) {
    return [...meetings].sort((x, y) => x.date.localeCompare(y.date)).map(m => {
      const t = tally(entries.filter(e => e.meetingId === m.id));
      return t.rate === null ? null : { label: fmtDate(m.date).slice(0, 5), value: t.rate };
    }).filter(Boolean);
  }

  /* ---------- رسم SVG: خط الاتجاه (الأقدم يمينًا حسب اتجاه العربية) ---------- */
  function trendSvg(points, boxW) {
    if (!points.length) return '<div class="empty-hint">لا توجد اجتماعات مسجل حضورها بعد.</div>';
    const W = Math.max(320, Math.min(900, Math.round(boxW) || 320)), H = Math.round(Math.min(260, Math.max(170, W * 0.38))), L = 14, R = 34, T = 22, B = 30, n = points.length;
    const step = n > 1 ? (W - L - R) / (n - 1) : 0;
    const X = i => n > 1 ? W - R - i * step : W / 2;
    const Y = v => T + (100 - v) / 100 * (H - T - B);
    const grid = [0, 50, 100].map(v => `<line class="g" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="ax" x="${W - 2}" y="${Y(v) - 2}" text-anchor="end">${v}%</text>`).join('');
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p.value).toFixed(1)}`).join(' ');
    const dots = points.map((p, i) => `<circle class="d" cx="${X(i).toFixed(1)}" cy="${Y(p.value).toFixed(1)}" r="4"/><text class="v" x="${X(i).toFixed(1)}" y="${(Y(p.value) - 8).toFixed(1)}" text-anchor="middle">${p.value}%</text><text class="lb" x="${X(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${p.label}</text>`).join('');
    const summary = points.map(p => `${p.label}: ${p.value}%`).join('، ');
    return `<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="اتجاه نسبة الحضور. ${summary}">${grid}${n > 1 ? `<path class="ln" d="${path}"/>` : ''}${dots}</svg>`;
  }
  function gradeBars(entries) {
    const rows = GRADES.map(g => {
      const t = tally(entries.filter(a => { const s = studentById(a.studentId); return s && s.grade === g; }));
      return `<div class="report-row"><div class="report-row-main"><strong>${g}</strong><small>${t.p} حضور · ${t.a} غياب</small><div class="rate-track"><div class="rate-fill" style="width:${t.rate ?? 0}%"></div></div></div><div class="rate-number">${t.rate === null ? '—' : t.rate + '%'}</div></div>`;
    });
    return `<div class="report-list">${rows.join('')}</div>`;
  }

  function extraDashboard() {
    $('allStat').textContent = db.students.length;
    const entries = db.attendance.filter(a => studentById(a.studentId));
    const t = tally(entries);
    $('overallRateStat').textContent = t.rate === null ? '—' : t.rate + '%';
    const recorded = db.meetings.filter(m => entries.some(e => e.meetingId === m.id));
    $('trendChart').innerHTML = trendSvg(meetingPoints(entries, recorded).slice(-8), $('trendChart').clientWidth);
  }
  function extraReports() {
    const { meetings, entries } = reportData();
    $('reportTrend').innerHTML = trendSvg(meetingPoints(entries, meetings).slice(-12), $('reportTrend').clientWidth);
    $('reportGradeCompare').innerHTML = gradeBars(entries);
  }

  /* ---------- معلومات التخزين ---------- */
  function renderStorageInfo() {
    const raw = safe(() => localStorage.getItem(STORAGE_KEY)) || '';
    const kb = (raw.length / 1024).toFixed(1);
    const sw = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
    const rows = [
      ['المخدومون', db.students.length], ['الاجتماعات', db.meetings.length],
      ['سجلات الحضور', db.attendance.length], ['الخدام', (db.servants || []).length],
      ['حجم البيانات المحفوظة', kb + ' ك.ب (تقريبي)'], ['إصدار بنية البيانات', db.version || DATA_VERSION],
      ['وضع التطبيق', standalone() ? 'مثبّت (Standalone)' : 'متصفح'],
      ['العمل بدون إنترنت', sw ? 'مفعّل' : 'غير مفعّل في هذه الجلسة']
    ];
    $('storageInfo').innerHTML = rows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('') +
      '<p class="muted info-note">البيانات محفوظة على هذا المتصفح فقط. التثبيت/إلغاء التثبيت أو مسح بيانات المتصفح قد يمسحها، فاحتفظ بنسخة JSON احتياطية دائمًا.</p>';
  }

  /* ---------- PWA: تسجيل Service Worker + زر التثبيت ---------- */
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let deferred = null;
  function setInstallUi() {
    const can = !!deferred && !standalone();
    document.querySelectorAll('.install-trigger').forEach(b => { b.hidden = !can; });
    const h = $('installHint');
    if (standalone()) h.textContent = 'التطبيق يعمل الآن كتطبيق مثبّت.';
    else if (can) h.textContent = 'اضغط «تثبيت» لإضافة التطبيق إلى شاشتك الرئيسية.';
    else if (location.protocol === 'file:') h.textContent = 'التثبيت لا يعمل عند فتح الملف مباشرة. شغّل الموقع عبر HTTPS أو localhost، ثم من قائمة Chrome (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».';
    else h.textContent = 'إن لم يظهر زر التثبيت: من قائمة المتصفح (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». يختلف ذلك حسب المتصفح والإصدار.';
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; setInstallUi(); });
  window.addEventListener('appinstalled', () => { deferred = null; setInstallUi(); });
  document.querySelectorAll('.install-trigger').forEach(b => b.addEventListener('click', async () => {
    if (!deferred) return;
    const d = deferred; deferred = null; setInstallUi();
    try { d.prompt(); await d.userChoice; } catch (e) { /* تجاهل */ }
  }));
  setInstallUi();
  const secure = location.protocol === 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if ('serviceWorker' in navigator && secure) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => { /* لا يؤثر على الاستخدام العادي */ });
    });
  }

  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { safe(extraDashboard); safe(extraReports); }, 200); });

  /* أول رسم */
  safe(extraDashboard); safe(extraReports); renderStorageInfo();
})();
