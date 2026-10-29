/* خدمة ثانوي v1.2 — إدارة الخدام + توزيعة الاجتماعات + تصدير PDF
   يعتمد على app.js (db, save, $, esc, normAr, toast, ...) وعلى pdf.js (PlanPDF). */
'use strict';

/* ===================== أدوات مشتركة ===================== */
function servantById(id){return (db.servants||[]).find(s=>s.id===id);}
function activeServantsList(){return (db.servants||[]).filter(s=>s.active!==false).sort((a,b)=>a.name.localeCompare(b.name,'ar'));}
function initialOf(name){return esc(String(name||'').trim().slice(0,1)||'؟');}
function assignmentsOf(servantId){let n=0;db.meetings.forEach(m=>(m.segments||[]).forEach(s=>{if(s.servantId===servantId)n++;}));return n;}
/* حالة الخادم داخل فقرة: ok / inactive / removed / none */
function segServant(seg){
  if(!seg.servantId&&!seg.servantName)return {name:'',state:'none'};
  const s=servantById(seg.servantId);
  if(s)return {name:s.name,state:s.active===false?'inactive':'ok'};
  return {name:seg.servantName||'',state:seg.servantName?'removed':'none'};
}
function stateNote(st){return st==='inactive'?'غير نشط':st==='removed'?'لم يعد في القائمة':'';}

/* نافذة تأكيد/تنبيه موحدة (Promise<boolean>) */
function askDialog({title='تأكيد',message='',items=[],okText='موافق',cancelText='إلغاء',hideCancel=false,danger=false}={}){
  return new Promise(resolve=>{
    const dlg=$('askDialog');
    $('askTitle').textContent=title;$('askMessage').textContent=message;
    const ul=$('askItems');ul.textContent='';items.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
    const ok=$('askOk'),cancel=$('askCancel');
    ok.textContent=okText;cancel.textContent=cancelText;cancel.hidden=hideCancel;
    ok.className=danger?'danger-btn':'primary-btn';
    let done=false;
    const finish=v=>{if(done)return;done=true;ok.onclick=cancel.onclick=null;dlg.removeEventListener('cancel',onEsc);if(dlg.open)dlg.close();resolve(v);};
    const onEsc=e=>{e.preventDefault();finish(false);};
    ok.onclick=()=>finish(true);cancel.onclick=()=>finish(false);dlg.addEventListener('cancel',onEsc);
    dlg.showModal();
  });
}
function afterDataChange(){
  save();
  renderMeetingSelect();renderDashboard();renderReports();
  if(activeView==='servants')renderServants();
  if(activeView==='plans')renderPlansView();
}

/* ===================== إدارة الخدام ===================== */
let servantPhotoData='';
function renderServants(){
  const q=normAr($('servantSearch').value),status=$('servantStatusFilter').value,skill=$('servantSkillFilter').value;
  // قائمة التخصصات
  const skills=[...new Set((db.servants||[]).map(s=>s.skill).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ar'));
  const sel=$('servantSkillFilter'),cur=sel.value;
  sel.innerHTML='<option value="">كل التخصصات</option>'+skills.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  sel.value=skills.includes(cur)?cur:'';
  const all=db.servants||[];
  const arr=all.filter(s=>{
    const act=s.active!==false;
    return (!q||normAr(s.name).includes(q))&&(status==='all'||(status==='active'&&act)||(status==='inactive'&&!act))&&(!sel.value||s.skill===sel.value);
  }).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  const activeCount=all.filter(s=>s.active!==false).length;
  $('servantsCount').textContent=`إجمالي الخدام: ${all.length} (نشط: ${activeCount}) · المعروض: ${arr.length}`;
  const list=$('servantsList');
  if(!all.length){list.innerHTML='<div class="panel empty-hint" style="grid-column:1/-1">لا يوجد خدام مسجلون بعد.<br>اضغط «＋ إضافة خادم» لتسجيل أول خادم، ثم اختره مسؤولًا عن فقرة من «التوزيعة».</div>';return;}
  if(!arr.length){list.innerHTML='<div class="panel empty-hint" style="grid-column:1/-1">لا توجد نتائج مطابقة للبحث أو الفلاتر.</div>';return;}
  list.innerHTML=arr.map(s=>{
    const n=assignmentsOf(s.id);
    const av=s.photo?`<img src="${esc(s.photo)}" alt="">`:initialOf(s.name);
    return `<article class="student-card ${s.active===false?'inactive':''}"><div class="avatar gold">${av}</div><div class="student-main"><strong>${esc(s.name)}</strong><div class="student-meta">${s.skill?`<span class="chip navy">${esc(s.skill)}</span>`:''}${s.active===false?'<span class="chip orange">غير نشط</span>':'<span class="chip green">نشط</span>'}<span class="chip">${n} فقرة مسندة</span></div>${s.phone||s.notes?`<div class="student-meta">${s.phone?`<span class="chip">${esc(s.phone)}</span>`:''}${s.notes?`<span class="chip">${esc(s.notes)}</span>`:''}</div>`:''}</div><div class="student-actions"><button class="mini-btn" data-sedit="${esc(s.id)}">تعديل</button><button class="mini-btn" data-sdel="${esc(s.id)}">حذف</button></div></article>`;
  }).join('');
  list.querySelectorAll('[data-sedit]').forEach(b=>b.addEventListener('click',()=>openServantForm(b.dataset.sedit)));
  list.querySelectorAll('[data-sdel]').forEach(b=>b.addEventListener('click',()=>deleteServant(b.dataset.sdel)));
}
['servantSearch'].forEach(id=>$(id).addEventListener('input',renderServants));
['servantStatusFilter','servantSkillFilter'].forEach(id=>$(id).addEventListener('change',renderServants));
$('addServantBtn').addEventListener('click',()=>openServantForm());
function setPhotoPreview(){const box=$('servantPhotoPreview');box.textContent='';if(servantPhotoData){const i=document.createElement('img');i.src=servantPhotoData;i.alt='';box.appendChild(i);}else box.textContent=($('servantName').value.trim().slice(0,1))||'؟';}
function openServantForm(id=null){
  const s=id?servantById(id):null;
  $('servantForm').reset();$('servantId').value=s?.id||'';$('servantNameError').textContent='';
  $('servantDialogTitle').textContent=s?'تعديل بيانات الخادم':'إضافة خادم';
  $('servantName').value=s?.name||'';$('servantPhone').value=s?.phone||'';$('servantSkill').value=s?.skill||'';$('servantNotes').value=s?.notes||'';
  $('servantActive').checked=s?s.active!==false:true;servantPhotoData=s?.photo||'';setPhotoPreview();
  $('servantDialog').showModal();
}
const closeServantForm=()=>$('servantDialog').close();
$('closeServantDialog').addEventListener('click',closeServantForm);$('cancelServantBtn').addEventListener('click',closeServantForm);
$('servantName').addEventListener('input',()=>{$('servantNameError').textContent='';if(!servantPhotoData)setPhotoPreview();});
$('servantPhotoRemove').addEventListener('click',()=>{servantPhotoData='';setPhotoPreview();});
$('servantPhotoInput').addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  if(!/^image\//.test(f.type)){toast('اختر ملف صورة صالحًا');return;}
  const rd=new FileReader();
  rd.onerror=()=>toast('تعذر قراءة الصورة');
  rd.onload=()=>{const img=new Image();img.onerror=()=>toast('تعذر فتح الصورة');img.onload=()=>{
    const S=160,c=document.createElement('canvas');c.width=c.height=S;const cx=c.getContext('2d');
    const m=Math.min(img.width,img.height),sx=(img.width-m)/2,sy=(img.height-m)/2;cx.drawImage(img,sx,sy,m,m,0,0,S,S);
    servantPhotoData=c.toDataURL('image/jpeg',0.8);setPhotoPreview();};img.src=rd.result;};
  rd.readAsDataURL(f);
});
$('servantForm').addEventListener('submit',e=>{
  e.preventDefault();
  const id=$('servantId').value,name=$('servantName').value.replace(/\s+/g,' ').trim();
  if(!name){$('servantNameError').textContent='اكتب اسم الخادم.';return;}
  const dup=db.servants.find(s=>s.id!==id&&normAr(s.name)===normAr(name));
  if(dup){$('servantNameError').textContent=`الخادم «${dup.name}» مسجل بنفس الاسم بالفعل.`;return;}
  const data={name,phone:$('servantPhone').value.trim(),skill:$('servantSkill').value.trim(),notes:$('servantNotes').value.trim(),active:$('servantActive').checked,photo:servantPhotoData};
  if(id){
    const s=servantById(id);Object.assign(s,data);
    db.meetings.forEach(m=>(m.segments||[]).forEach(g=>{if(g.servantId===id)g.servantName=name;}));
    toast('تم تعديل بيانات الخادم');
  }else{db.servants.push({id:uid('V'),createdAt:today(),...data});toast('تمت إضافة الخادم');}
  try{afterDataChange();}catch(err){console.error(err);toast('تعذر الحفظ: مساحة التخزين ممتلئة');return;}
  closeServantForm();
});
async function deleteServant(id){
  const s=servantById(id);if(!s)return;
  const n=assignmentsOf(id);
  const ok=await askDialog({title:'حذف خادم',message:`هل تريد حذف «${s.name}» من قائمة الخدام؟`,items:n?[`له ${n} فقرة في توزيعات الاجتماعات؛ ستبقى هذه التوزيعات كما هي باسمه مع إشارة أنه «لم يعد في القائمة».`,'يمكنك بدلًا من الحذف جعله «غير نشط» من زر التعديل.']:[],okText:'حذف',danger:true});
  if(!ok)return;
  db.servants=db.servants.filter(x=>x.id!==id);   // أسماء الفقرات السابقة محفوظة داخل الفقرات نفسها
  afterDataChange();toast('تم حذف الخادم');
}

/* ===================== التحقق من التوزيعة ===================== */
const toMin=t=>{const m=/^(\d{1,2}):(\d{2})$/.exec(t||'');return m?(+m[1])*60+(+m[2]):null;};
function validatePlan(m,segments,notes){
  const errors=[],warnings=[];
  if(!String(m.name||'').trim())errors.push('اسم الاجتماع فارغ.');
  if(!validYmd(m.date))errors.push('تاريخ الاجتماع غير صحيح.');
  const sm=toMin(m.startTime),em=toMin(m.endTime);
  if(sm!=null&&em!=null&&em<=sm)errors.push('وقت نهاية الاجتماع يجب أن يكون بعد وقت بدايته.');
  if(!segments.length)errors.push('لا توجد فقرات في هذا الاجتماع.');
  segments.forEach((g,i)=>{
    const label=g.title?`«${g.title}»`:`الفقرة رقم ${i+1}`;
    if(!String(g.title||'').trim())errors.push(`الفقرة رقم ${i+1} بلا اسم.`);
    const a=toMin(g.start),b=toMin(g.end);
    if(a!=null&&b!=null&&b<=a)errors.push(`وقت نهاية ${label} يجب أن يكون بعد بدايتها.`);
    const sv=segServant(g);
    if(sv.state==='none')warnings.push(`الفقرة ${label} بلا خادم مسؤول.`);
    else if(sv.state==='inactive')warnings.push(`الخادم «${sv.name}» (فقرة ${label}) غير نشط حاليًا.`);
  });
  const timed=segments.map(g=>({g,a:toMin(g.start),b:toMin(g.end)})).filter(x=>x.a!=null&&x.b!=null&&x.b>x.a).sort((x,y)=>x.a-y.a);
  for(let i=1;i<timed.length;i++)if(timed[i].a<timed[i-1].b)warnings.push(`تداخل في الوقت بين «${timed[i-1].g.title||'فقرة'}» و«${timed[i].g.title||'فقرة'}».`);
  return {errors,warnings};
}
function planStats(m){
  const segs=m.segments||[];
  const unassigned=segs.filter(g=>segServant(g).state==='none').length;
  const people=new Set(segs.filter(g=>segServant(g).state!=='none').map(g=>g.servantId||normAr(g.servantName))).size;
  return {count:segs.length,unassigned,people,complete:segs.length>0&&unassigned===0};
}

/* ===================== قائمة الاجتماعات ===================== */
let planTab='upcoming',openPlanId=null,editing=false,draft=null,dirty=false;
const STATUS_AR={upcoming:'قادم',completed:'مكتمل',cancelled:'ملغي'};
function statusChip(st){return `<span class="chip ${st==='upcoming'?'navy':st==='completed'?'green':'orange'}">${STATUS_AR[st]||''}</span>`;}
function renderPlansView(){
  if(openPlanId&&meetingById(openPlanId)){$('plansListPane').hidden=true;$('planDetailPane').hidden=false;renderPlanDetail();return;}
  openPlanId=null;$('plansListPane').hidden=false;$('planDetailPane').hidden=true;renderPlanList();
}
function renderPlanList(){
  document.querySelectorAll('#planTabs .tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===planTab));
  let arr=db.meetings.filter(m=>planTab==='all'||(planTab==='upcoming'&&m.status==='upcoming')||(planTab==='past'&&m.status==='completed')||(planTab==='cancelled'&&m.status==='cancelled'));
  arr=arr.sort((a,b)=>planTab==='upcoming'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  const list=$('planMeetingsList');
  if(!arr.length){list.innerHTML=`<div class="panel empty-hint">${planTab==='upcoming'?'لا توجد اجتماعات قادمة. اجتماع كل جمعة يُنشأ تلقائيًا، أو اضغط «＋ اجتماع جديد».':'لا توجد اجتماعات في هذا القسم.'}</div>`;return;}
  list.innerHTML=arr.map(m=>{
    const st=planStats(m),[y,mo,d]=m.date.split('-');
    const warn=m.status==='upcoming'&&st.unassigned?`<span class="chip red">⚠ ${st.unassigned} بلا خادم</span>`:(m.status==='upcoming'&&st.complete?'<span class="chip green">التوزيعة مكتملة</span>':'');
    return `<article class="plan-card ${m.status==='cancelled'?'cancelled':''}"><div class="meeting-date-badge"><strong style="font-size:15px">${esc(d)}</strong><br>${esc(mo)}/${esc(y)}</div><div class="meeting-main"><strong>${esc(m.name)}</strong><small>${esc(weekdayName(m.date))} ${esc(fmtDate(m.date))}${m.startTime?` · ${esc(PlanPDF.time12(m.startTime))}`:''}</small><div class="student-meta">${statusChip(m.status)}<span class="chip">${st.count} فقرة</span><span class="chip">${st.people} خادم</span>${warn}</div></div><button class="mini-btn" data-open-plan="${esc(m.id)}">فتح التوزيعة</button></article>`;
  }).join('');
  list.querySelectorAll('[data-open-plan]').forEach(b=>b.addEventListener('click',()=>openPlan(b.dataset.openPlan)));
}
document.querySelectorAll('#planTabs .tab').forEach(b=>b.addEventListener('click',()=>{planTab=b.dataset.tab;renderPlanList();}));

/* اجتماع جديد / تعديل بيانات اجتماع */
function openPlanMeetingForm(id=null){
  const m=id?meetingById(id):null;
  $('planMeetingForm').reset();$('pmError').textContent='';$('pmId').value=m?.id||'';
  $('planMeetingTitle').textContent=m?'تعديل بيانات الاجتماع':'اجتماع جديد';
  $('pmName').value=m?m.name:WEEKLY_NAME;$('pmDate').value=m?m.date:addDays(today(),1);$('pmStatus').value=m?m.status:'upcoming';
  $('pmStart').value=m?.startTime||'';$('pmEnd').value=m?.endTime||'';$('pmNotes').value=m?.notes||'';
  $('planMeetingDialog').showModal();
}
$('newPlanMeetingBtn').addEventListener('click',()=>openPlanMeetingForm());
const closePM=()=>$('planMeetingDialog').close();
$('closePlanMeeting').addEventListener('click',closePM);$('cancelPlanMeeting').addEventListener('click',closePM);
$('planMeetingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const id=$('pmId').value,name=$('pmName').value.replace(/\s+/g,' ').trim(),date=$('pmDate').value,status=$('pmStatus').value;
  const startTime=$('pmStart').value,endTime=$('pmEnd').value,notes=$('pmNotes').value.trim();
  const err=msg=>{$('pmError').textContent=msg;};
  if(!name)return err('اكتب اسم الاجتماع.');
  if(!validYmd(date))return err('اختر تاريخًا صحيحًا.');
  if(startTime&&endTime&&toMin(endTime)<=toMin(startTime))return err('وقت النهاية يجب أن يكون بعد وقت البداية.');
  const dup=db.meetings.find(x=>x.id!==id&&x.date===date&&normAr(x.name)===normAr(name)&&x.status!=='cancelled');
  if(dup)return err('يوجد اجتماع بنفس الاسم والتاريخ بالفعل. غيّر الاسم أو التاريخ لتجنب التكرار.');
  let m=id?meetingById(id):null;
  if(m){Object.assign(m,{name,date,status,startTime,endTime,notes});toast('تم تعديل بيانات الاجتماع');}
  else{m={id:uid('M'),date,name,grade:'',type:'manual',status,startTime,endTime,notes,segments:defaultSegments(db),createdAt:new Date().toISOString()};db.meetings.push(m);toast('تم إنشاء الاجتماع');}
  closePM();afterDataChange();
  if(!id){planTab='all';openPlan(m.id);}
});

/* الفقرات الافتراضية */
$('editTemplateBtn').addEventListener('click',()=>{$('templateText').value=segmentTemplate(db).join('\n');$('templateDialog').showModal();});
const closeTpl=()=>$('templateDialog').close();
$('closeTemplate').addEventListener('click',closeTpl);$('cancelTemplate').addEventListener('click',closeTpl);
$('templateReset').addEventListener('click',()=>{$('templateText').value=DEFAULT_SEGMENTS.join('\n');});
$('templateForm').addEventListener('submit',e=>{
  e.preventDefault();
  const lines=[...new Set($('templateText').value.split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean))];
  if(!lines.length){toast('اكتب فقرة واحدة على الأقل');return;}
  db.settings.segmentTemplate=lines;save();closeTpl();toast('تم حفظ الفقرات الافتراضية');
});

/* ===================== تفاصيل الاجتماع ===================== */
function openPlan(id){
  const m=meetingById(id);if(!m)return;
  openPlanId=id;editing=m.status==='upcoming';dirty=false;draft=editing?cloneDraft(m):null;
  if(activeView!=='plans'){go('plans');return;}
  renderPlansView();window.scrollTo({top:0});
}
function cloneDraft(m){return {segments:(m.segments||[]).map(g=>({...g})),notes:m.notes||''};}
async function closePlan(){
  if(editing&&dirty){const ok=await askDialog({title:'تعديلات غير محفوظة',message:'عندك تعديلات لم تُحفظ. هل تريد تجاهلها والرجوع؟',okText:'تجاهل والرجوع',cancelText:'البقاء',danger:true});if(!ok)return;}
  openPlanId=null;editing=false;draft=null;dirty=false;renderPlansView();
}
function currentSegments(m){return editing&&draft?draft.segments:(m.segments||[]);}
function planDetailStatsHtml(m,segs){
  const tmp={segments:segs};const st=planStats(tmp);
  return `<div class="plan-stats"><div class="plan-stat"><small>عدد الفقرات</small><strong>${st.count}</strong></div><div class="plan-stat"><small>عدد الخدام المشاركين</small><strong>${st.people}</strong></div><div class="plan-stat"><small>حالة التوزيعة</small><strong class="${st.complete?'good':'bad'}">${st.complete?'مكتملة':st.count?`ناقصة (${st.unassigned} بلا خادم)`:'لا فقرات'}</strong></div></div>`;
}
function timeText(g){
  const T=PlanPDF.time12;
  if(g.start&&g.end)return `من ${T(g.start)} إلى ${T(g.end)}`;
  if(g.start)return `من ${T(g.start)}`;if(g.end)return `حتى ${T(g.end)}`;
  if(g.duration)return `${g.duration} دقيقة`;return '—';
}
function renderPlanDetail(){
  const m=meetingById(openPlanId),pane=$('planDetailPane');if(!m){closePlan();return;}
  const segs=currentSegments(m);
  const timeLine=m.startTime&&m.endTime?`من ${PlanPDF.time12(m.startTime)} إلى ${PlanPDF.time12(m.endTime)}`:m.startTime?`يبدأ ${PlanPDF.time12(m.startTime)}`:m.endTime?`ينتهي ${PlanPDF.time12(m.endTime)}`:'';
  const v=validatePlan(m,segs,'');
  let banner='';
  if(v.errors.length&&!editing)banner+=`<div class="plan-banner err"><b>يلزم تصحيح:</b><br>${v.errors.map(esc).join('<br>')}</div>`;
  if(v.warnings.length&&!editing)banner+=`<div class="plan-banner"><b>تنبيهات:</b><br>${v.warnings.map(esc).join('<br>')}</div>`;
  pane.innerHTML=`<button class="back-btn" id="planBack">→ الرجوع لقائمة الاجتماعات</button>
  <section class="plan-head"><div class="plan-head-top"><img src="assets/logo-khedmet-thanawy-sm.png" alt="شعار خدمة ثانوي" width="58" height="63"><div style="min-width:0"><h2>${esc(m.name)}</h2><p>${esc(weekdayName(m.date))} ${esc(PlanPDF.dateLongAr(m.date))}${timeLine?' · '+esc(timeLine):''}</p><div class="student-meta">${statusChip(m.status)}${m.type==='weekly'?'<span class="chip">أسبوعي تلقائي</span>':''}</div></div></div>${planDetailStatsHtml(m,segs)}</section>
  <div class="plan-actions"><button class="secondary-btn" id="pmEditBtn" ${editing?'disabled title="احفظ التوزيعة أو ألغِ التعديل أولًا"':''}>✎ بيانات الاجتماع</button></div>
  ${banner}
  <div id="planBody"></div>
  <div class="plan-actions" id="planButtons"></div>`;
  $('planBack').addEventListener('click',closePlan);
  $('pmEditBtn').addEventListener('click',()=>openPlanMeetingForm(m.id));
  renderPlanBody(m);renderPlanButtons(m);
}
function renderPlanButtons(m){
  const box=$('planButtons');box.textContent='';
  const mk=(txt,cls,fn)=>{const b=document.createElement('button');b.className=cls;b.textContent=txt;b.addEventListener('click',fn);box.appendChild(b);return b;};
  if(editing){mk('حفظ التوزيعة','primary-btn',saveDraft);mk('إلغاء التعديل','secondary-btn',cancelEdit);}
  else mk('تعديل التوزيعة','primary-btn',startEdit);
  mk('معاينة PDF','secondary-btn',()=>previewPlan(m.id));
  mk('تصدير PDF','primary-btn',()=>exportPlan(m.id));
  mk('طباعة التوزيعة','secondary-btn',()=>printPlan(m.id));
}
function renderPlanBody(m){
  const body=$('planBody');
  if(editing){renderEditor(m);return;}
  const segs=m.segments||[];
  if(!segs.length){body.innerHTML='<div class="panel empty-hint">لا توجد فقرات في هذا الاجتماع. اضغط «تعديل التوزيعة» ثم «إضافة فقرة».</div>';return;}
  const rows=segs.map((g,i)=>{
    const sv=segServant(g),none=sv.state==='none';
    const who=none?'<span class="who-none">لم يُحدَّد الخادم بعد</span>':`${esc(sv.name)}${sv.state!=='ok'?`<span class="who-flag">(${stateNote(sv.state)})</span>`:''}`;
    return `<tr class="${none?'unassigned':''}"><td class="c" data-label="م">${i+1}</td><td class="seg-title seg-title-cell" data-label="الفقرة">${esc(g.title)}</td><td data-label="الخادم المسؤول">${who}</td><td class="c" data-label="الوقت أو المدة">${esc(timeText(g))}</td><td data-label="ملاحظات">${g.notes?esc(g.notes):'—'}</td></tr>`;
  }).join('');
  body.innerHTML=`<div class="plan-table-wrap"><table class="plan-table"><thead><tr><th class="c" style="width:44px">م</th><th>الفقرة</th><th>الخادم المسؤول</th><th class="c">الوقت أو المدة</th><th>ملاحظات</th></tr></thead><tbody>${rows}</tbody></table></div>${m.notes&&m.notes.trim()?`<div class="plan-notes"><b>ملاحظات عامة</b><span id="planNotesText"></span></div>`:''}`;
  const nt=document.getElementById('planNotesText');if(nt)nt.textContent=m.notes;
}

/* ---------- وضع التعديل ---------- */
function startEdit(){const m=meetingById(openPlanId);editing=true;dirty=false;draft=cloneDraft(m);renderPlanDetail();}
async function cancelEdit(){
  if(dirty){const ok=await askDialog({title:'إلغاء التعديل',message:'سيتم تجاهل التعديلات غير المحفوظة.',okText:'تجاهل التعديلات',cancelText:'متابعة التعديل',danger:true});if(!ok)return;}
  editing=false;draft=null;dirty=false;renderPlanDetail();
}
function markDirty(){dirty=true;}
function refreshLiveInfo(){
  // تحديث الإحصاءات والتنبيهات أثناء التعديل دون إعادة بناء الصفوف
  const m=meetingById(openPlanId);if(!m)return;
  const st=document.querySelector('#planDetailPane .plan-stats');if(st){const t=document.createElement('div');t.innerHTML=planDetailStatsHtml(m,draft.segments);st.replaceWith(t.firstChild);}
}
function servantOptionsFor(g){
  const frag=document.createDocumentFragment();
  const none=document.createElement('option');none.value='';none.textContent='— بدون خادم (يُحدَّد لاحقًا) —';frag.appendChild(none);
  const act=activeServantsList();
  const cur=segServant(g);
  if(cur.state==='inactive'||cur.state==='removed'){const o=document.createElement('option');o.value=g.servantId||'__removed';o.textContent=`${cur.name} (${stateNote(cur.state)})`;frag.appendChild(o);}
  act.forEach(s=>{const o=document.createElement('option');o.value=s.id;o.textContent=s.name+(s.skill?` — ${s.skill}`:'');frag.appendChild(o);});
  return frag;
}
function el(tag,props={},kids=[]){const e=document.createElement(tag);Object.entries(props).forEach(([k,v])=>{if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k in e&&k!=='list')e[k]=v;else e.setAttribute(k,v);});kids.forEach(k=>e.appendChild(k));return e;}
function buildSegRow(g,i){
  const row=el('div',{class:'seg-row','data-sid':g.id});
  const handle=el('button',{class:'drag-handle',type:'button',title:'اسحب لإعادة الترتيب','aria-label':'اسحب لإعادة الترتيب',text:'⋮⋮'});
  const num=el('span',{class:'seg-num',text:String(i+1)});
  const title=el('input',{class:'seg-title-in',type:'text',maxLength:80,placeholder:'اسم الفقرة','aria-label':'اسم الفقرة'});title.value=g.title;
  const up=el('button',{class:'mini-btn',type:'button',title:'تحريك لأعلى','aria-label':'تحريك لأعلى',text:'▲'}),down=el('button',{class:'mini-btn',type:'button',title:'تحريك لأسفل','aria-label':'تحريك لأسفل',text:'▼'}),del=el('button',{class:'mini-btn',type:'button',title:'حذف الفقرة','aria-label':'حذف الفقرة',text:'🗑'});
  row.appendChild(el('div',{class:'seg-line'},[handle,num,title,el('div',{class:'seg-tools'},[up,down,del])]));
  const sel=el('select',{'aria-label':'الخادم المسؤول'});sel.appendChild(servantOptionsFor(g));sel.value=g.servantId&&[...sel.options].some(o=>o.value===g.servantId)?g.servantId:'';
  row.appendChild(sel);
  const st=el('input',{type:'time','aria-label':'وقت البداية'}),en=el('input',{type:'time','aria-label':'وقت النهاية'}),du=el('input',{type:'number',min:1,max:600,placeholder:'دقائق','aria-label':'المدة بالدقائق'});
  st.value=g.start||'';en.value=g.end||'';du.value=g.duration||'';
  row.appendChild(el('div',{class:'time-line'},[el('span',{text:'من'}),st,el('span',{text:'إلى'}),en,el('span',{class:'dur'},[el('span',{text:'أو مدة'}),du,el('span',{text:'د'})])]));
  const notes=el('input',{type:'text',maxLength:200,placeholder:'ملاحظات الفقرة (اختياري)','aria-label':'ملاحظات الفقرة'});notes.value=g.notes||'';
  row.appendChild(notes);
  const mark=()=>row.classList.toggle('unassigned',!sel.value);mark();
  title.addEventListener('input',()=>{g.title=title.value;markDirty();});
  notes.addEventListener('input',()=>{g.notes=notes.value;markDirty();});
  st.addEventListener('change',()=>{g.start=st.value;markDirty();});en.addEventListener('change',()=>{g.end=en.value;markDirty();});
  du.addEventListener('input',()=>{const n=parseInt(du.value,10);g.duration=n>0?n:'';markDirty();});
  sel.addEventListener('change',()=>{
    const s=servantById(sel.value);
    if(s){g.servantId=s.id;g.servantName=s.name;}
    else if(!sel.value){g.servantId='';g.servantName='';}   // الباقي (محذوف/غير نشط) يبقى كما هو إن لم يتغير
    mark();markDirty();refreshLiveInfo();
  });
  up.addEventListener('click',()=>moveSeg(g.id,-1));down.addEventListener('click',()=>moveSeg(g.id,1));
  del.addEventListener('click',()=>removeSeg(g.id));
  handle.addEventListener('pointerdown',e=>startDrag(e,row,handle));
  return row;
}
function renderEditor(m){
  const body=$('planBody');body.textContent='';
  if(!activeServantsList().length){
    const n=el('div',{class:'plan-banner'});n.textContent='لا يوجد خدام نشطون بعد، لذلك ستكون قائمة اختيار المسؤول فارغة. ';
    const b=el('button',{class:'soft-btn',type:'button',text:'إضافة خادم من قسم الخدام'});b.addEventListener('click',async()=>{if(dirty){const ok=await askDialog({title:'تعديلات غير محفوظة',message:'احفظ التوزيعة أولًا حتى لا تفقد تعديلاتك.',okText:'تابع بدون حفظ',cancelText:'البقاء',danger:true});if(!ok)return;}editing=false;draft=null;dirty=false;openPlanId=null;go('servants');});
    n.appendChild(b);body.appendChild(n);
  }
  const rows=el('div',{class:'seg-rows',id:'segRows'});body.appendChild(rows);
  draft.segments.forEach((g,i)=>rows.appendChild(buildSegRow(g,i)));
  if(!draft.segments.length)rows.appendChild(el('div',{class:'panel empty-hint',text:'لا توجد فقرات. اضغط «＋ إضافة فقرة».'}));
  const add=el('button',{class:'secondary-btn add-seg-btn',type:'button',text:'＋ إضافة فقرة'});add.addEventListener('click',addSeg);body.appendChild(add);
  const lab=el('label',{class:'stack-label',style:'margin-top:12px'});lab.appendChild(document.createTextNode('ملاحظات عامة (تظهر أسفل الجدول، وتُخفى إن كانت فارغة)'));
  const ta=el('textarea',{rows:3,maxLength:600});ta.value=draft.notes;ta.addEventListener('input',()=>{draft.notes=ta.value;markDirty();});lab.appendChild(ta);body.appendChild(lab);
}
function addSeg(){
  const g=newSegment('فقرة جديدة');draft.segments.push(g);markDirty();renderEditor(meetingById(openPlanId));refreshLiveInfo();
  const row=document.querySelector(`[data-sid="${g.id}"] .seg-title-in`);if(row){row.focus();row.select();row.scrollIntoView({block:'center',behavior:'smooth'});}
}
function moveSeg(id,dir){
  const a=draft.segments,i=a.findIndex(g=>g.id===id),j=i+dir;if(i<0||j<0||j>=a.length)return;
  [a[i],a[j]]=[a[j],a[i]];markDirty();renderEditor(meetingById(openPlanId));
  const r=document.querySelector(`[data-sid="${id}"]`);if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'});
}
async function removeSeg(id){
  const g=draft.segments.find(x=>x.id===id);if(!g)return;
  const ok=await askDialog({title:'حذف فقرة',message:`حذف الفقرة «${g.title||'بدون اسم'}» من هذا الاجتماع؟`,items:['لن يتأثر أي اجتماع آخر.','يمكنك إلغاء التعديل قبل الحفظ للتراجع.'],okText:'حذف الفقرة',danger:true});
  if(!ok)return;draft.segments=draft.segments.filter(x=>x.id!==id);markDirty();renderEditor(meetingById(openPlanId));refreshLiveInfo();
}
/* السحب والإفلات (يعمل بالماوس واللمس) */
function startDrag(e,row,handle){   // المستمعات على window لأن نقل العنصر في DOM يُسقط التقاط المؤشر
  e.preventDefault();const cont=row.parentElement;
  const grab=e.clientY-row.getBoundingClientRect().top;row.classList.add('dragging');
  const move=ev=>{
    row.style.transform='';
    let before=null;
    for(const s of cont.children){if(s===row)continue;const r=s.getBoundingClientRect();if(ev.clientY<r.top+r.height/2){before=s;break;}}
    if(before!==row.nextElementSibling)cont.insertBefore(row,before);
    const nat=row.getBoundingClientRect().top;row.style.transform=`translateY(${ev.clientY-grab-nat}px)`;
    if(ev.clientY<70)window.scrollBy(0,-12);else if(ev.clientY>innerHeight-70)window.scrollBy(0,12);
  };
  const up=()=>{
    window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    row.style.transform='';row.classList.remove('dragging');
    const order=[...cont.querySelectorAll('.seg-row')].map(r=>r.dataset.sid);
    const byId=new Map(draft.segments.map(g=>[g.id,g]));const next=order.map(i=>byId.get(i)).filter(Boolean);
    if(next.length===draft.segments.length&&next.some((g,i)=>g!==draft.segments[i])){draft.segments=next;markDirty();}
    cont.querySelectorAll('.seg-num').forEach((n,i)=>n.textContent=String(i+1));
  };
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}
async function saveDraft(){
  const m=meetingById(openPlanId);if(!m||!editing)return false;
  draft.segments.forEach(g=>{g.title=String(g.title||'').trim();});
  const v=validatePlan(m,draft.segments,draft.notes);
  const blocking=v.errors.filter(x=>!/لا توجد فقرات/.test(x));
  if(blocking.length){await askDialog({title:'تعذر حفظ التوزيعة',message:'صحّح البيانات التالية ثم احفظ:',items:blocking,okText:'حسنًا',hideCancel:true});return false;}
  const overlaps=v.warnings.filter(x=>x.startsWith('تداخل'));
  if(overlaps.length){const ok=await askDialog({title:'تداخل في الأوقات',message:'توجد فقرات متداخلة في الوقت. هل تريد الحفظ رغم ذلك؟',items:overlaps,okText:'حفظ رغم ذلك',cancelText:'تعديل الأوقات'});if(!ok)return false;}
  m.segments=draft.segments.map(g=>{const s=normSegment(g);const sv=servantById(s.servantId);if(sv)s.servantName=sv.name;return s;});
  m.notes=draft.notes.trim();
  editing=false;draft=null;dirty=false;
  try{afterDataChange();}catch(err){console.error(err);toast('تعذر الحفظ: مساحة التخزين ممتلئة');return false;}
  toast('تم حفظ التوزيعة');return true;
}

/* ===================== PDF: تصدير / معاينة / طباعة ===================== */
function pdfPlanData(m){
  return {name:m.name,date:m.date,weekday:weekdayName(m.date),dateText:PlanPDF.dateLongAr(m.date),start:m.startTime,end:m.endTime,notes:m.notes||'',
    segments:(m.segments||[]).map(g=>{const sv=segServant(g);return {title:g.title,servant:sv.name,start:g.start,end:g.end,duration:g.duration,notes:g.notes};})};
}
/* يضمن أن المحفوظ هو الذي يُصدَّر: إن كانت هناك تعديلات غير محفوظة يُعرض الحفظ أولًا */
async function ensureSaved(){
  if(!editing||!dirty)return true;
  const ok=await askDialog({title:'تعديلات غير محفوظة',message:'الـPDF يعتمد على آخر نسخة محفوظة. هل تريد حفظ التوزيعة الآن والمتابعة؟',okText:'حفظ ومتابعة',cancelText:'إلغاء'});
  if(!ok)return false;return saveDraft();
}
async function validateForOutput(m,{strict}){
  const v=validatePlan(m,m.segments||[],m.notes);
  if(v.errors.length){await askDialog({title:'لا يمكن إنشاء الملف',message:'صحّح البيانات التالية أولًا:',items:v.errors,okText:'حسنًا',hideCancel:true});return false;}
  if(strict&&v.warnings.length){return askDialog({title:'التوزيعة غير مكتملة',message:'توجد ملاحظات على التوزيعة. هل تريد المتابعة رغم ذلك؟ (يمكنك استكمالها لاحقًا)',items:v.warnings,okText:'متابعة',cancelText:'رجوع للتعديل'});}
  return true;
}
function makePdf(m){
  const layout=PlanPDF.buildLayout(pdfPlanData(m));
  const bytes=PlanPDF.toPdfBytes(layout);
  return {layout,bytes,name:PlanPDF.pdfFileName(m.name,m.date),blob:new Blob([bytes],{type:'application/pdf'})};
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
}
async function exportPlan(id,skipChecks){
  const m=meetingById(id);if(!m)return;
  if(!skipChecks){if(!await ensureSaved())return;if(!await validateForOutput(m,{strict:true}))return;}
  try{const r=makePdf(m);downloadBlob(r.blob,r.name);toast('تم تصدير الملف: '+r.name);}
  catch(err){console.error(err);toast('تعذر إنشاء ملف PDF');}
}
let previewState=null;
async function previewPlan(id){
  const m=meetingById(id);if(!m)return;
  if(!await ensureSaved())return;if(!await validateForOutput(m,{strict:false}))return;
  const box=$('previewPages');box.innerHTML='<div class="empty-hint">جارٍ تجهيز المعاينة…</div>';
  $('previewTitle').textContent=`${m.name} — ${fmtDate(m.date)}`;
  $('previewShare').hidden=true;$('previewDialog').showModal();
  try{
    if(typeof DecompressionStream==='undefined')throw new Error('nostream');
    const r=makePdf(m);previewState={id,r};
    const canvases=await PlanPDF.renderCanvases(r.layout,1.6);
    box.textContent='';canvases.forEach(c=>{c.setAttribute('role','img');c.setAttribute('aria-label','صفحة من التوزيعة');box.appendChild(c);});
    try{const f=new File([r.blob],r.name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]}))$('previewShare').hidden=false;}catch(e){}
  }catch(err){console.error(err);box.innerHTML='<div class="empty-hint">المعاينة غير مدعومة في هذا المتصفح. يمكنك استخدام «تصدير PDF» مباشرة.</div>';previewState={id,r:null};}
}
const closePreview=()=>{$('previewDialog').close();previewState=null;$('previewPages').textContent='';};
$('closePreview').addEventListener('click',closePreview);$('previewClose').addEventListener('click',closePreview);
$('previewExport').addEventListener('click',()=>{if(previewState)exportPlan(previewState.id,true);});
$('previewPrint').addEventListener('click',()=>{if(previewState)printPlan(previewState.id,true);});
$('previewShare').addEventListener('click',async()=>{
  if(!previewState||!previewState.r)return;const r=previewState.r;
  try{await navigator.share({files:[new File([r.blob],r.name,{type:'application/pdf'})],title:r.name});}catch(e){if(e&&e.name!=='AbortError')toast('تعذرت المشاركة، استخدم تصدير PDF');}
});
async function printPlan(id,skipChecks){
  const m=meetingById(id);if(!m)return;
  if(!skipChecks){if(!await ensureSaved())return;if(!await validateForOutput(m,{strict:true}))return;}
  try{
    if(typeof DecompressionStream==='undefined')throw new Error('nostream');
    const r=makePdf(m);const canvases=await PlanPDF.renderCanvases(r.layout,3);
    const area=$('printArea');area.textContent='';
    canvases.forEach(c=>{const i=new Image();i.alt='';i.src=c.toDataURL('image/png');area.appendChild(i);});
    const prevTitle=document.title;document.title=r.name.replace(/\.pdf$/,'');
    const cleanup=()=>{area.textContent='';document.title=prevTitle;window.removeEventListener('afterprint',cleanup);};
    window.addEventListener('afterprint',cleanup);
    await Promise.all([...area.querySelectorAll('img')].map(i=>i.decode?i.decode().catch(()=>{}):Promise.resolve()));
    setTimeout(()=>window.print(),50);
  }catch(err){console.error(err);toast('تعذرت الطباعة من هذا المتصفح. صدّر الملف ثم اطبعه.');}
}

/* ===================== ربط عام ===================== */
function refreshPlanViews(){
  if(activeView==='servants')renderServants();
  if(activeView==='plans'){
    if(editing&&dirty)return;            // لا نكتب فوق تعديلات غير محفوظة
    renderPlansView();
  }
}
renderServants();
