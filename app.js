/* خدمة ثانوي v1.2 - local-first: الحضور + إدارة الخدام + توزيعة الاجتماعات */
const SEED_STUDENTS = [{"id":"S001","name":"مهرائيل رايح","phone":"01228346688","phoneOwner":"الأم","birthDate":"5/25","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S002","name":"يوستينا مرقس رفعت","phone":"01207177926","phoneOwner":"الأب","birthDate":"11/11","address":"مزارع","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S003","name":"مارجرينا ثروت","phone":"01202430245","phoneOwner":"الأم","birthDate":"11/4","address":"29","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S004","name":"مونيكا مجدي","phone":"01128398504","phoneOwner":"المخدوم","birthDate":"3/1","address":"النجاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S005","name":"كارولين أسامه","phone":"01159225291","phoneOwner":"الأم","birthDate":"10/1","address":"النجاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S006","name":"انطونيوس سامح","phone":"01026197523","phoneOwner":"الأب","birthDate":"7/8","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S007","name":"كاراس سامح","phone":"01026197523","phoneOwner":"الأب","birthDate":"7/8","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S008","name":"افرام ميلاد","phone":"01157998458","phoneOwner":"الأم","birthDate":"6/23","address":"29","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S009","name":"روفائيل سامي","phone":"01558551331","phoneOwner":"المخدوم","birthDate":"8/2","address":"النجاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S010","name":"انطونيوس فادي","phone":"01557742362","phoneOwner":"المخدوم","birthDate":"2/15","address":"النجاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S011","name":"بيتر فرج","phone":"01202772902","phoneOwner":"الأم","birthDate":"3/16","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S012","name":"مينا عصفور رفعت","phone":"01229721670","phoneOwner":"الأب","birthDate":"","address":"مزارع","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S013","name":"ستيفن البير","phone":"01280520060","phoneOwner":"الأم","birthDate":"4/4","address":"عين جالوت","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S014","name":"يسي وحيد","phone":"01289688545","phoneOwner":"الأم","birthDate":"1/27","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S015","name":"توماس عماد","phone":"01200734991","phoneOwner":"الأم","birthDate":"6/18","address":"مرتاح","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S016","name":"كاراس سعيد بدير","phone":"01225460833","phoneOwner":"الأب","birthDate":"","address":"28","grade":"أولى ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S017","name":"فانا ميلاد","phone":"01203988380","phoneOwner":"المخدوم","birthDate":"3/26","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S018","name":"انطونيوس رفعت","phone":"01503804465","phoneOwner":"المخدوم","birthDate":"5/9","address":"النجاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S019","name":"ابرام سامح","phone":"01553393868","phoneOwner":"المخدوم","birthDate":"8/24","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S020","name":"كاراس اسحاق","phone":"واتساب 01014897431  فون01129608687","phoneOwner":"المخدوم","birthDate":"7/30","address":"29","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S021","name":"كيرلس سمير عبده","phone":"01212967929","phoneOwner":"المخدوم","birthDate":"3/6","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S022","name":"عادل فايز","phone":"01117489481","phoneOwner":"الأب","birthDate":"10/12","address":"الشروق","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S023","name":"مجدي هاني","phone":"01147048925","phoneOwner":"الأخ","birthDate":"","address":"","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S024","name":"كيرلس فادي السيد","phone":"01122278980","phoneOwner":"المخدوم","birthDate":"","address":"النجاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S025","name":"رزق عادل","phone":"01282390626","phoneOwner":"المخدوم","birthDate":"2/14","address":"العفاشات","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S026","name":"مايكل سمير","phone":"01277105889","phoneOwner":"الأخ","birthDate":"7/27","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S027","name":"روماني صلاح","phone":"01222908521","phoneOwner":"الأب","birthDate":"6/6","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S028","name":"بيشوي مرقس رفعت","phone":"01207177926","phoneOwner":"الأب","birthDate":"شهر 8","address":"الأراضي","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S029","name":"جوليانا اسامه","phone":"01159225291","phoneOwner":"الأم","birthDate":"2/17","address":"النجاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S030","name":"دميانه عماد","phone":"01204135416","phoneOwner":"الأب","birthDate":"10/10","address":"28","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S031","name":"ماريا سامح","phone":"01551307253","phoneOwner":"المخدوم","birthDate":"7/18","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S032","name":"مارينا فادي","phone":"01279441792","phoneOwner":"المخدوم","birthDate":"3/6","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S033","name":"مريم فادي","phone":"01279441792","phoneOwner":"المخدوم","birthDate":"3/6","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S034","name":"أفرونية ميلاد","phone":"01286858348","phoneOwner":"الأم","birthDate":"7/30","address":"29","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S035","name":"رومينا انسي","phone":"01141662761","phoneOwner":"المخدوم","birthDate":"4/4","address":"النجاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S036","name":"ايريني شنودة","phone":"01223007803","phoneOwner":"الأب","birthDate":"12/-","address":"مزارع","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S037","name":"جاكلين سامي","phone":"01274383119","phoneOwner":"المخدوم","birthDate":"2/12","address":"النجاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S038","name":"يوانا حنا","phone":"الأب: 01116391750  الأخت:01128473800","phoneOwner":"","birthDate":"3/7","address":"الفالوجا","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S039","name":"ماريا عماد جرجس","phone":"01204135416","phoneOwner":"","birthDate":"","address":"مرتاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S040","name":"ساندي روماني","phone":"01557526969","phoneOwner":"","birthDate":"","address":"","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S041","name":"يوستينا ميلاد","phone":"01550568745","phoneOwner":"","birthDate":"","address":"الكفاح","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S042","name":"كيرلس وائل","phone":"01208404990","phoneOwner":"الأب","birthDate":"","address":"الصعايدة","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"},{"id":"S043","name":"مينا رضا","phone":"01094945054","phoneOwner":"المخدوم","birthDate":"3/5","address":"29","grade":"تالتة ثانوي","education":"","notes":"","active":true,"createdAt":"2026-10-29"}];

// بيانات الخدام المضافة في الإصدار الحالي
const SEED_SERVANTS = [
  {id:'V001',name:'شيرين جاد',phone:'01220208577'},
  {id:'V002',name:'سامي ناجي',phone:'01101999589'},
  {id:'V003',name:'هاني عوني',phone:'01224941955'},
  {id:'V004',name:'نرمين رابح',phone:'01228346688'},
  {id:'V005',name:'حنان ارساني',phone:'01067504968'},
  {id:'V006',name:'ماري عادل',phone:'01016153775'},
  {id:'V007',name:'ابانوب اسحق',phone:'01010764056'}
].map(s=>({...s,photo:'',skill:'',notes:'',active:true,createdAt:'2026-10-29'}));

const SEED_SECONDARY_STUDENTS = [
  {id:'S044',name:'فيرونيكا روماني',phone:'01550390292',gender:'بنت'},
  {id:'S045',name:'مهرائيل جورج',phone:'01276005845',gender:'بنت'},
  {id:'S046',name:'مهرائيل جرجس',phone:'01553219424',gender:'بنت'},
  {id:'S047',name:'يؤانا صابر',phone:'01559210342',gender:'بنت'},
  {id:'S048',name:'مريم هاني',phone:'01211594269',gender:'بنت'},
  {id:'S049',name:'يوأنا حنا',phone:'01101316910',gender:'بنت'},
  {id:'S050',name:'يوستينا',phone:'01220801375',gender:'بنت'},
  {id:'S051',name:'إيلاريا أمجد',phone:'01227228347',gender:'بنت'},
  {id:'S052',name:'أبانوب كرم',phone:'01009319857',gender:'ولد'},
  {id:'S053',name:'ريمون عادل',phone:'',gender:'ولد'},
  {id:'S054',name:'فيلوباتير نادر',phone:'',gender:'ولد'},
  {id:'S055',name:'كاراس رمزي',phone:'',gender:'ولد'},
  {id:'S056',name:'كاراس روماني',phone:'01555697211',gender:'ولد'}
].map(s=>({...s,phoneOwner:'',birthDate:'',address:'',grade:'تانية ثانوي',education:'',notes:'',active:true,createdAt:'2026-10-29'}));

const STORAGE_KEY = 'khedmet-thanawy-v1'; // نفس المفتاح القديم للحفاظ على البيانات الحالية
const DATA_VERSION = 3;
const DEFAULT_SEGMENTS = ['الترانيم','الفقرة الافتتاحية','الأسئلة','الدرس'];
const MEETING_STATUSES = ['upcoming','completed','cancelled'];
const GENDERS = ['ولد','بنت','غير محدد'];
const GRADES = ['أولى ثانوي','تانية ثانوي','تالتة ثانوي'];
const EDU_NONE = '__none';
const WEEKDAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const WEEKLY_NAME = 'اجتماع الخدمة';
const WEEKS_BACK = 8, WEEKS_AHEAD = 8;
/* تصنيف مبدئي للنوع حسب الاسم (للأسماء الواضحة فقط). الاسم غير الواضح = غير محدد. يمكن تعديله يدويًا لكل مخدوم. */
const GENDER_SEED = {};
'S006 S007 S008 S009 S010 S011 S012 S013 S014 S015 S016 S018 S019 S020 S021 S022 S023 S024 S025 S026 S027 S028 S042 S043'.split(' ').forEach(id=>GENDER_SEED[id]='ولد');
'S002 S003 S004 S005 S029 S030 S031 S032 S033 S034 S035 S036 S037 S038 S039 S040 S041'.split(' ').forEach(id=>GENDER_SEED[id]='بنت');

const $ = (id) => document.getElementById(id);
const pad = n => String(n).padStart(2,'0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
function parseYmd(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);}
function addDays(s,n){const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d);}
function fridayOnOrBefore(s){return addDays(s,-((parseYmd(s).getDay()-5+7)%7));}
function weekdayName(s){return WEEKDAYS[parseYmd(s).getDay()];}
const esc = (v='') => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const digits = s => String(s||'').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const phoneDigits = s => digits(s).replace(/\D/g,'');
const normAr = s => digits(String(s||'')).toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();

function freshData(){return {version:DATA_VERSION,students:[...SEED_STUDENTS,...SEED_SECONDARY_STUDENTS].map(s=>({...s})),meetings:[],attendance:[],servants:SEED_SERVANTS.map(s=>({...s})),settings:{}};}

/* ===== v1.2: الفقرات والخدام (تهيئة آمنة لا تمس البيانات الموجودة) ===== */
function segmentTemplate(d){const t=d&&d.settings&&Array.isArray(d.settings.segmentTemplate)?d.settings.segmentTemplate.map(x=>String(x||'').trim()).filter(Boolean):[];return t.length?t:DEFAULT_SEGMENTS;}
function newSegment(title,extra){return {id:uid('G'),title:String(title||'').trim(),servantId:'',servantName:'',start:'',end:'',duration:'',notes:'',...(extra||{})};}
function defaultSegments(d){return segmentTemplate(d).map(t=>newSegment(t));}
function normSegment(s){
  const o=s&&typeof s==='object'?s:{};
  const dur=o.duration===''||o.duration==null?'':Number(o.duration);
  return {id:o.id||uid('G'),title:String(o.title||'').trim(),servantId:o.servantId||'',servantName:String(o.servantName||''),start:/^\d{1,2}:\d{2}$/.test(o.start||'')?o.start:'',end:/^\d{1,2}:\d{2}$/.test(o.end||'')?o.end:'',duration:Number.isFinite(dur)&&dur>0?Math.round(dur):'',notes:String(o.notes||'')};
}
function validYmd(s){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!m)return false;const dt=new Date(+m[1],+m[2]-1,+m[3]);return dt.getFullYear()===+m[1]&&dt.getMonth()===+m[2]-1&&dt.getDate()===+m[3]&&+m[1]>=2000&&+m[1]<=2100;}
function normServant(s){
  const o=s&&typeof s==='object'?s:{};
  return {id:o.id||uid('V'),name:String(o.name||'').trim(),phone:String(o.phone||'').trim(),photo:typeof o.photo==='string'&&o.photo.startsWith('data:image/')?o.photo:'',skill:String(o.skill||'').trim(),notes:String(o.notes||'').trim(),active:o.active!==false,createdAt:o.createdAt||today()};
}

/* إنشاء اجتماع الجمعة تلقائيًا: معرّف ثابت W-YYYY-MM-DD يمنع التكرار مهما تكرر فتح الموقع */
function ensureWeekly(d){
  d.settings=d.settings||{};
  const t=today(), thisFri=fridayOnOrBefore(t);
  if(!d.settings.weeklyStart) d.settings.weeklyStart=addDays(thisFri,-7*WEEKS_BACK);
  /* التكرار يُمنع بالخانة الأصلية (slot) لا بالتاريخ الحالي: تغيير تاريخ اجتماع لا يولّد نسخة جديدة */
  const have=new Set(d.meetings.filter(m=>m.type==='weekly').map(m=>m.slot||m.date));
  const haveIds=new Set(d.meetings.map(m=>m.id));
  const end=addDays(thisFri,7*WEEKS_AHEAD);
  let changed=false;
  for(let day=d.settings.weeklyStart;day<=end;day=addDays(day,7)){
    if(!have.has(day)&&!haveIds.has('W-'+day)){d.meetings.push({id:'W-'+day,date:day,slot:day,name:WEEKLY_NAME,grade:'',type:'weekly',status:day<t?'completed':'upcoming',startTime:'',endTime:'',notes:'',segments:defaultSegments(d),createdAt:new Date().toISOString()});have.add(day);changed=true;}
  }
  /* الاجتماع القادم الذي مضى تاريخه يصبح «مكتمل» تلقائيًا (يمكن تعديله يدويًا) */
  d.meetings.forEach(m=>{if(m.status==='upcoming'&&validYmd(m.date)&&m.date<t){m.status='completed';changed=true;}});
  return changed;
}
/* Migration آمن: لا يحذف شيئًا، يضيف الحقول الجديدة فقط ويزيل أي تكرار في (اجتماع، مخدوم) */
function migrate(d){
  const seedById=new Map(SEED_STUDENTS.map(s=>[s.id,s]));
  const students=d.students.map(s=>{
    const o={...s};
    if(!GENDERS.includes(o.gender)){const seed=seedById.get(o.id);o.gender=(seed&&seed.name===o.name&&GENDER_SEED[o.id])||'غير محدد';}
    if(o.active===undefined)o.active=true;
    return o;
  });
  // أضف السجلات الجديدة إلى قواعد البيانات المحلية الموجودة دون المساس بالسجلات القديمة.
  const studentIds=new Set(students.map(s=>s.id));
  [...SEED_STUDENTS,...SEED_SECONDARY_STUDENTS].forEach(seed=>{
    if(!studentIds.has(seed.id)){students.push({...seed});studentIds.add(seed.id);}
  });
  const mMap=new Map();
  const t0=today();
  d.meetings.forEach(m=>{if(m&&m.id&&!mMap.has(m.id)){
    const type=m.type||'legacy';
    mMap.set(m.id,{...m,type,
      slot:type==='weekly'?(m.slot||m.date):m.slot,
      status:MEETING_STATUSES.includes(m.status)?m.status:(m.date<t0?'completed':'upcoming'),
      startTime:/^\d{1,2}:\d{2}$/.test(m.startTime||'')?m.startTime:'',endTime:/^\d{1,2}:\d{2}$/.test(m.endTime||'')?m.endTime:'',
      notes:String(m.notes||''),
      segments:Array.isArray(m.segments)?m.segments.map(normSegment):defaultSegments(d)});
  }});
  const sMap=new Map();
  (Array.isArray(d.servants)?d.servants:[]).forEach(x=>{const s=normServant(x);if(s.name&&!sMap.has(s.id))sMap.set(s.id,s);});
  const servantNames=new Set([...sMap.values()].map(s=>normAr(s.name)));
  SEED_SERVANTS.forEach(seed=>{
    const key=normAr(seed.name);
    if(key&&!servantNames.has(key)){sMap.set(seed.id,normServant(seed));servantNames.add(key);}
  });
  const aMap=new Map();
  d.attendance.forEach(a=>{if(a&&a.meetingId&&a.studentId)aMap.set(a.meetingId+'|'+a.studentId,a);});
  const out={version:DATA_VERSION,students,meetings:[...mMap.values()],attendance:[...aMap.values()],servants:[...sMap.values()],settings:{...(d.settings||{})}};
  ensureWeekly(out);
  return out;
}
function loadData(){
  let raw=null;
  try{raw=localStorage.getItem(STORAGE_KEY);}catch(e){}
  if(!raw)return migrate(freshData());
  try{
    const d=JSON.parse(raw);
    if(d&&Array.isArray(d.students)&&Array.isArray(d.meetings)&&Array.isArray(d.attendance)){
      if((d.version||1)<DATA_VERSION){try{if(!localStorage.getItem(STORAGE_KEY+'-premigration-v1'))localStorage.setItem(STORAGE_KEY+'-premigration-v1',raw);}catch(e){}}
      return migrate(d);
    }
  }catch(e){console.warn('تعذر قراءة البيانات المحلية',e);}
  try{localStorage.setItem(STORAGE_KEY+'-corrupt-'+Date.now(),raw);}catch(e){}
  return migrate(freshData());
}
let db=loadData(), activeView='dashboard', selectedStudentId=null, selectedMeetingId=null, attMeetingId=null;
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
function uid(prefix){return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);}
function activeStudents(){return db.students.filter(s=>s.active!==false);}
function studentById(id){return db.students.find(s=>s.id===id);}
function meetingById(id){return db.meetings.find(m=>m.id===id);}
function statusLabel(s){return s==='present'?'حاضر':s==='absent'?'غائب':s==='excused'?'معتذر':'لم يسجل';}
function fmtDate(d){if(!d)return '—';const [y,m,day]=d.split('-');return `${day}/${m}/${y}`;}
function genderChip(g){return g==='ولد'?'<span class="chip boy">ولد</span>':g==='بنت'?'<span class="chip girl">بنت</span>':'<span class="chip">النوع غير محدد</span>';}
function entriesOf(meetingId){return db.attendance.filter(a=>a.meetingId===meetingId);}
function meetingLabel(m){
  const tag=m.date===today()?' (اليوم)':'';
  const extra=m.type==='weekly'?'':(m.type==='manual'?' · إضافي':'')+(m.grade?' · '+m.grade:'');
  const st=m.status==='cancelled'?' · ملغي':'';
  return `${m.name} — ${weekdayName(m.date)} ${fmtDate(m.date)}${tag}${extra}${st}`;
}
function defaultMeetingId(){
  const t=today();
  const weekly=db.meetings.filter(m=>m.type==='weekly').sort((a,b)=>b.date.localeCompare(a.date));
  const cur=weekly.find(m=>m.date===t)||weekly.find(m=>m.date<=t)||weekly[weekly.length-1]||db.meetings[0];
  return cur?cur.id:null;
}
function go(view){
  activeView=view;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view+'View'));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  if(view==='dashboard') renderDashboard();
  if(view==='students') renderStudents();
  if(view==='attendance'){renderMeetingSelect();renderRoster();}
  if(view==='reports') renderReports();
  if(view==='servants'&&typeof renderServants==='function') renderServants();
  if(view==='plans'&&typeof renderPlansView==='function') renderPlansView();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));

function renderDashboard(){
  $('totalStat').textContent=activeStudents().length;
  const t=today();
  const recorded=db.meetings.filter(m=>entriesOf(m.id).length);
  $('meetingsStat').textContent=recorded.length;
  const last=[...recorded].sort((a,b)=>b.date.localeCompare(a.date))[0];
  $('gradeCards').innerHTML=GRADES.map(g=>`<button class="grade-card" data-grade="${g}"><span>${g}</span><strong>${activeStudents().filter(s=>s.grade===g).length}</strong><em>عرض المخدومين ←</em></button>`).join('');
  $('gradeCards').querySelectorAll('[data-grade]').forEach(b=>b.addEventListener('click',()=>{go('students');$('gradeFilter').value=b.dataset.grade;renderStudents();}));
  // بطاقة اجتماع الجمعة
  const weekly=db.meetings.filter(m=>m.type==='weekly');
  const todayM=weekly.find(m=>m.date===t);
  const next=todayM||weekly.filter(m=>m.date>t).sort((a,b)=>a.date.localeCompare(b.date))[0];
  if(next){
    const n=entriesOf(next.id).length;
    $('nextMeetingCard').innerHTML=`<div class="next-meeting-main"><span class="eyebrow">${todayM?'اجتماع اليوم':'الاجتماع القادم'}</span><strong>${WEEKLY_NAME}</strong><small>${weekdayName(next.date)} ${fmtDate(next.date)}${n?` · ${n} حالة مسجلة`:' · جاهز لتسجيل الحضور'}</small></div><div class="next-actions"><button class="primary-btn" id="openNextMeeting">${todayM?'سجّل الحضور':'فتح الاجتماع'}</button><button class="secondary-btn" id="openNextPlan">توزيعة الفقرات</button></div>`;
    $('openNextMeeting').addEventListener('click',()=>{attMeetingId=next.id;go('attendance');});
    $('openNextPlan').addEventListener('click',()=>{if(typeof openPlan==='function'){go('plans');openPlan(next.id);}});
  } else $('nextMeetingCard').innerHTML='';
  if(!last){$('presentStat').textContent='—';$('absentStat').textContent='—';$('lastMeetingDate').textContent='لا توجد اجتماعات مسجلة حضورها حتى الآن';$('lastMeetingSummary').className='empty-state compact';$('lastMeetingSummary').textContent='ابدأ بتسجيل حضور أول اجتماع للخدمة.';return;}
  const entries=entriesOf(last.id);
  const present=entries.filter(a=>a.status==='present').length, absent=entries.filter(a=>a.status==='absent').length, excused=entries.filter(a=>a.status==='excused').length;
  $('presentStat').textContent=present;$('absentStat').textContent=absent;
  $('lastMeetingDate').textContent=`${last.name} · ${fmtDate(last.date)}`;
  $('lastMeetingSummary').className='';$('lastMeetingSummary').innerHTML=`<div class="stats-grid" style="margin:0"><article class="stat-card"><span class="stat-label">حاضر</span><strong>${present}</strong></article><article class="stat-card"><span class="stat-label">غائب</span><strong>${absent}</strong></article></div>${excused?`<p class="muted" style="margin:10px 0 0;font-size:12px">معتذر: ${excused}</p>`:''}`;
}

/* ===== المخدومون: بحث وفلاتر (AND بين كل الشروط) ===== */
function filteredStudents(){
  const q=normAr($('studentSearch').value), qDigits=phoneDigits($('studentSearch').value);
  const gender=$('genderFilter').value, grade=$('gradeFilter').value, education=$('educationFilter').value, status=$('statusFilter').value;
  return db.students.filter(s=>{
    const isActive=s.active!==false;
    const textOk=!q||normAr(s.name).includes(q)||(qDigits.length>0&&phoneDigits(s.phone).includes(qDigits));
    const genderOk=!gender||(s.gender||'غير محدد')===gender;
    const gradeOk=!grade||s.grade===grade;
    const eduOk=!education||(education===EDU_NONE?!s.education:s.education===education);
    const statusOk=status==='all'||(status==='active'&&isActive)||(status==='inactive'&&!isActive);
    return textOk&&genderOk&&gradeOk&&eduOk&&statusOk;
  }).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
}
function renderStudents(){
  const arr=filteredStudents();
  $('studentsCount').textContent=`${arr.length} مخدوم مطابق من أصل ${db.students.length}`;
  $('studentsList').innerHTML=arr.length?arr.map(s=>`<article class="student-card ${s.active===false?'inactive':''}"><div class="avatar ${s.gender==='ولد'?'boy':s.gender==='بنت'?'girl':''}">${esc(s.name.trim().split(/\s+/)[0]?.slice(0,1)||'؟')}</div><div class="student-main"><strong>${esc(s.name)}</strong><div class="student-meta">${genderChip(s.gender)}<span class="chip">${esc(s.grade)}</span><span class="chip">${s.education?'تعليم '+esc(s.education):'نوع التعليم غير محدد'}</span>${s.active===false?'<span class="chip orange">غير نشط</span>':''}</div><div class="student-meta">${s.phone?`<span class="chip">${esc(s.phone)}</span>`:''}</div></div><div class="student-actions"><button class="mini-btn" data-details="${s.id}">الملف</button><button class="mini-btn" data-edit="${s.id}">تعديل</button></div></article>`).join(''):'<div class="panel empty-hint">لا توجد نتائج مطابقة لهذه الفلاتر. جرّب تغيير البحث أو اضغط «مسح الفلاتر».</div>';
  $('studentsList').querySelectorAll('[data-details]').forEach(b=>b.addEventListener('click',()=>openDetails(b.dataset.details)));
  $('studentsList').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openStudentForm(b.dataset.edit)));
}
['studentSearch','genderFilter','gradeFilter','educationFilter','statusFilter'].forEach(id=>$(id).addEventListener(id==='studentSearch'?'input':'change',renderStudents));
$('clearFiltersBtn').addEventListener('click',()=>{
  $('studentSearch').value='';$('genderFilter').value='';$('gradeFilter').value='';$('educationFilter').value='';$('statusFilter').value='active';renderStudents();
});
$('addStudentBtn').addEventListener('click',()=>openStudentForm());

function openStudentForm(id=null){
  const s=id?studentById(id):null;
  $('studentForm').reset();$('studentId').value=s?.id||'';
  $('studentDialogTitle').textContent=s?'تعديل بيانات المخدوم':'إضافة مخدوم';
  $('studentName').value=s?.name||'';$('studentPhone').value=s?.phone||'';$('studentPhoneOwner').value=s?.phoneOwner||'';
  $('studentGender').value=GENDERS.includes(s?.gender)?s.gender:'غير محدد';
  $('studentEducation').value=s?.education||'';$('studentGrade').value=s?.grade||'أولى ثانوي';$('studentBirth').value=s?.birthDate||'';
  $('studentAddress').value=s?.address||'';$('studentNotes').value=s?.notes||'';$('studentActive').checked=s?s.active!==false:true;
  $('studentDialog').showModal();
}
function closeStudentForm(){$('studentDialog').close();}
$('closeStudentDialog').addEventListener('click',closeStudentForm);$('cancelStudentBtn').addEventListener('click',closeStudentForm);
$('studentForm').addEventListener('submit',e=>{
  e.preventDefault();const id=$('studentId').value;const name=$('studentName').value.trim();
  if(!name){toast('اكتب اسم المخدوم');return;}
  const data={name,gender:$('studentGender').value,phone:$('studentPhone').value.trim(),phoneOwner:$('studentPhoneOwner').value,education:$('studentEducation').value,grade:$('studentGrade').value,birthDate:$('studentBirth').value.trim(),address:$('studentAddress').value.trim(),notes:$('studentNotes').value.trim(),active:$('studentActive').checked};
  if(id){Object.assign(studentById(id),data);toast('تم تعديل بيانات المخدوم');}
  else{data.id=uid('S');data.createdAt=today();db.students.push(data);toast('تمت إضافة المخدوم');}
  save();closeStudentForm();renderStudents();renderDashboard();if(activeView==='reports')renderReports();
});
function openDetails(id){
  const s=studentById(id);if(!s)return;selectedStudentId=id;$('detailsName').textContent=s.name;
  const items=[['النوع',s.gender||'غير محدد'],['الصف الدراسي',s.grade],['نوع التعليم',s.education||'لم يحدد بعد'],['رقم التواصل',s.phone||'غير مسجل'],['صاحب الرقم',s.phoneOwner||'غير محدد'],['تاريخ الميلاد',s.birthDate||'غير مسجل'],['العنوان',s.address||'غير مسجل'],['الحالة',s.active===false?'غير نشط':'نشط'],['ملاحظات',s.notes||'لا توجد']];
  const history=db.attendance.filter(a=>a.studentId===id).map(a=>({a,m:meetingById(a.meetingId)})).filter(x=>x.m).sort((a,b)=>b.m.date.localeCompare(a.m.date));
  $('studentDetailsContent').innerHTML=`<div class="detail-grid">${items.map(([k,v])=>`<div class="detail-item"><small>${k}</small><strong>${esc(v)}</strong></div>`).join('')}</div><h3 class="history-title">سجل الحضور</h3>${history.length?history.slice(0,8).map(x=>`<div class="meeting-row"><div class="meeting-date-badge">${fmtDate(x.m.date)}</div><div class="meeting-main"><strong>${esc(x.m.name)}</strong><small>${esc(weekdayName(x.m.date))}${x.m.grade?' · '+esc(x.m.grade):''}</small></div><span class="chip ${x.a.status==='present'?'green':x.a.status==='absent'?'orange':''}">${statusLabel(x.a.status)}</span></div>`).join(''):'<div class="empty-hint">لا يوجد سجل حضور حتى الآن.</div>'}`;
  $('studentDetailsDialog').showModal();
}
function closeDetails(){$('studentDetailsDialog').close();}
$('closeDetailsDialog').addEventListener('click',closeDetails);$('detailsCloseBtn').addEventListener('click',closeDetails);
$('detailsEditBtn').addEventListener('click',()=>{const id=selectedStudentId;closeDetails();openStudentForm(id);});

/* ===== الحضور: اجتماع دوري واحد + كشف لكل صف ===== */
function renderMeetingSelect(){
  const t=today();
  if(!attMeetingId||!meetingById(attMeetingId))attMeetingId=defaultMeetingId();
  const upcoming=db.meetings.filter(m=>m.date>t).sort((a,b)=>a.date.localeCompare(b.date));
  const past=db.meetings.filter(m=>m.date<=t).sort((a,b)=>b.date.localeCompare(a.date));
  const opt=m=>`<option value="${esc(m.id)}" ${m.id===attMeetingId?'selected':''}>${esc(meetingLabel(m))}</option>`;
  $('meetingSelect').innerHTML=`<optgroup label="اليوم والاجتماعات السابقة">${past.map(opt).join('')}</optgroup><optgroup label="الاجتماعات القادمة">${upcoming.map(opt).join('')}</optgroup>`;
  $('meetingSelect').value=attMeetingId||'';
}
function renderRoster(){
  const m=meetingById(attMeetingId);
  const grade=$('attendanceGrade').value, education=$('attendanceEducation').value;
  const arr=activeStudents().filter(s=>(!grade||s.grade===grade)&&(!education||(education===EDU_NONE?!s.education:s.education===education))).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  const saved=m?new Map(entriesOf(m.id).map(a=>[a.studentId,a.status])):new Map();
  $('attendanceListTitle').textContent=`كشف ${grade||'كل الصفوف'}`;
  const done=arr.filter(s=>saved.has(s.id)).length;
  $('attendanceCount').textContent=`${arr.length} مخدوم · ${done} مسجّل`;
  $('attendanceRoster').innerHTML=!m?'<div class="empty-hint">لا يوجد اجتماع محدد.</div>':arr.length?arr.map(s=>{const st=saved.get(s.id)||'';return `<div class="roster-row"><div class="avatar ${s.gender==='ولد'?'boy':s.gender==='بنت'?'girl':''}">${esc(s.name.trim().split(/\s+/)[0]?.slice(0,1)||'؟')}</div><div class="roster-name">${esc(s.name)}<span class="roster-sub">${esc(s.grade)}${s.education?' · '+esc(s.education):''}</span></div><select class="status-select ${st}" data-attendance-student="${s.id}" aria-label="حالة ${esc(s.name)}"><option value="" ${st===''?'selected':''}>لم يسجل</option><option value="present" ${st==='present'?'selected':''}>حاضر</option><option value="absent" ${st==='absent'?'selected':''}>غائب</option><option value="excused" ${st==='excused'?'selected':''}>معتذر</option></select></div>`;}).join(''):'<div class="empty-hint">لا يوجد مخدومون نشطون في هذا الصف/نوع التعليم. يمكنك تغيير الاختيارات أو إضافة مخدومين.</div>';
  $('attendanceRoster').querySelectorAll('.status-select').forEach(sel=>sel.addEventListener('change',()=>sel.className='status-select '+sel.value));
}
$('meetingSelect').addEventListener('change',()=>{
  attMeetingId=$('meetingSelect').value;
  const m=meetingById(attMeetingId);
  if(m&&m.type!=='weekly'&&m.grade&&GRADES.includes(m.grade))$('attendanceGrade').value=m.grade; // اجتماع قديم مرتبط بصف
  renderRoster();
});
['attendanceGrade','attendanceEducation'].forEach(id=>$(id).addEventListener('change',renderRoster));
function setAllStatuses(status){document.querySelectorAll('#attendanceRoster .status-select').forEach(s=>{s.value=status;s.className='status-select '+status;});}
$('allPresentBtn').addEventListener('click',()=>setAllStatuses('present'));
$('allAbsentBtn').addEventListener('click',()=>setAllStatuses('absent'));
$('clearStatusBtn').addEventListener('click',()=>setAllStatuses(''));
$('meetingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const m=meetingById(attMeetingId);
  if(!m){toast('اختر اجتماعًا أولًا');return;}
  const selects=[...document.querySelectorAll('#attendanceRoster .status-select')];
  if(!selects.length){toast('لا يوجد مخدومون في الكشف');return;}
  let saved=0;
  selects.forEach(sel=>{
    const sid=sel.dataset.attendanceStudent, st=sel.value;
    const idx=db.attendance.findIndex(a=>a.meetingId===m.id&&a.studentId===sid);
    if(!st){if(idx>-1)db.attendance.splice(idx,1);return;}
    if(idx>-1)db.attendance[idx].status=st; else db.attendance.push({id:uid('A'),meetingId:m.id,studentId:sid,status:st});
    saved++;
  });
  save();toast(saved?`تم حفظ ${saved} حالة في ${m.name}`:'لا توجد حالات مسجلة لحفظها');renderMeetingSelect();renderRoster();renderDashboard();renderReports();
});
/* اجتماع إضافي يدوي */
$('openExtraMeetingBtn').addEventListener('click',()=>{$('extraMeetingForm').reset();$('extraMeetingDate').value=today();$('extraMeetingDialog').showModal();});
$('closeExtraDialog').addEventListener('click',()=>$('extraMeetingDialog').close());$('cancelExtraBtn').addEventListener('click',()=>$('extraMeetingDialog').close());
$('extraMeetingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const date=$('extraMeetingDate').value,name=$('extraMeetingName').value.trim();
  if(!date||!name){toast('اكتب اسم الاجتماع وتاريخه');return;}
  let m=db.meetings.find(x=>x.type==='manual'&&x.date===date&&normAr(x.name)===normAr(name));
  if(!m){m={id:uid('M'),date,name,grade:'',type:'manual',createdAt:new Date().toISOString()};db.meetings.push(m);toast('تم إنشاء الاجتماع الإضافي');}
  else toast('هذا الاجتماع موجود بالفعل، تم فتحه');
  save();attMeetingId=m.id;$('extraMeetingDialog').close();renderMeetingSelect();renderRoster();renderDashboard();
});

/* ===== التقارير: لا تُحتسب الحالات غير المسجلة ===== */
function reportData(){
  const from=$('reportFrom').value,to=$('reportTo').value,grade=$('reportGrade').value;
  const inRange=db.meetings.filter(m=>(!from||m.date>=from)&&(!to||m.date<=to));
  const ids=new Set(inRange.map(m=>m.id));
  let entries=db.attendance.filter(a=>ids.has(a.meetingId)&&studentById(a.studentId));
  if(grade)entries=entries.filter(a=>studentById(a.studentId).grade===grade);
  const withEntries=new Set(entries.map(a=>a.meetingId));
  return {meetings:inRange.filter(m=>withEntries.has(m.id)),entries};
}
function renderReports(){
  const {meetings,entries}=reportData();
  const present=entries.filter(a=>a.status==='present').length,absent=entries.filter(a=>a.status==='absent').length,excused=entries.filter(a=>a.status==='excused').length;
  $('reportMeetings').textContent=meetings.length;$('reportPresent').textContent=present;$('reportAbsent').textContent=absent;
  const counted=present+absent;
  $('reportRate').textContent=counted?Math.round(present/counted*100)+'%':'—';
  $('reportExcused').textContent=excused?`معتذر: ${excused} (لا يدخل في نسبة الحضور)`:'';
  const eligible=db.students.filter(s=>s.active!==false&&(!$('reportGrade').value||s.grade===$('reportGrade').value));
  const rows=eligible.map(s=>{const own=entries.filter(a=>a.studentId===s.id);const p=own.filter(a=>a.status==='present').length;const a=own.filter(a=>a.status==='absent').length;const c=p+a;return {s,p,a,c,rate:c?Math.round(p/c*100):null};}).sort((a,b)=>(a.rate??-1)-(b.rate??-1));
  $('studentReportList').innerHTML=rows.length?rows.map(r=>`<div class="report-row"><div class="report-row-main"><strong>${esc(r.s.name)}</strong><small>${esc(r.s.grade)} · ${r.p} حضور · ${r.a} غياب</small><div class="rate-track"><div class="rate-fill" style="width:${r.rate??0}%"></div></div></div><div class="rate-number">${r.rate===null?'—':r.rate+'%'}</div></div>`).join(''):'<div class="empty-hint">لا توجد بيانات لعرضها.</div>';
  $('meetingsList').innerHTML=meetings.length?[...meetings].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>{const es=entries.filter(a=>a.meetingId===m.id),p=es.filter(a=>a.status==='present').length,ab=es.filter(a=>a.status==='absent').length,ex=es.filter(a=>a.status==='excused').length;return `<div class="meeting-row"><div class="meeting-date-badge">${fmtDate(m.date)}</div><div class="meeting-main"><strong>${esc(m.name)}${m.type==='manual'?' (إضافي)':''}</strong><small>${esc(weekdayName(m.date))}${m.grade?' · '+esc(m.grade):''} · ${p} حاضر · ${ab} غائب${ex?' · '+ex+' معتذر':''}</small></div><button class="mini-btn" data-meeting-details="${m.id}">الكشف</button><button class="mini-btn" data-meeting-delete="${m.id}">${m.type==='weekly'?'مسح الحضور':'حذف'}</button></div>`;}).join(''):'<div class="empty-hint">لا توجد اجتماعات مسجل حضورها في الفترة المحددة.</div>';
  $('meetingsList').querySelectorAll('[data-meeting-details]').forEach(b=>b.addEventListener('click',()=>openMeetingDetails(b.dataset.meetingDetails)));
  $('meetingsList').querySelectorAll('[data-meeting-delete]').forEach(b=>b.addEventListener('click',()=>deleteMeeting(b.dataset.meetingDelete)));
}
$('applyReportBtn').addEventListener('click',renderReports);
function openMeetingDetails(id){
  const m=meetingById(id);if(!m)return;selectedMeetingId=id;$('meetingDetailsTitle').textContent=m.name+' · '+fmtDate(m.date);
  const es=entriesOf(id).map(a=>({a,s:studentById(a.studentId)})).filter(x=>x.s).sort((x,y)=>x.s.grade.localeCompare(y.s.grade,'ar')||x.s.name.localeCompare(y.s.name,'ar'));
  $('meetingDetailsContent').innerHTML=`<p class="muted">${esc(weekdayName(m.date))} · ${es.length} حالة مسجلة</p>${es.map(x=>`<div class="meeting-row"><div class="meeting-main"><strong>${esc(x.s.name)}</strong><small>${esc(x.s.grade)}${x.s.education?' · '+esc(x.s.education):''}</small></div><span class="chip ${x.a.status==='present'?'green':x.a.status==='absent'?'orange':''}">${statusLabel(x.a.status)}</span></div>`).join('')||'<div class="empty-hint">الكشف فارغ.</div>'}`;
  $('meetingDetailsDialog').showModal();
}
function closeMeetingDetails(){$('meetingDetailsDialog').close();}
$('closeMeetingDetails').addEventListener('click',closeMeetingDetails);$('meetingDetailsCloseBtn').addEventListener('click',closeMeetingDetails);
function deleteMeeting(id){
  const m=meetingById(id);if(!m)return;
  if(m.type==='weekly'){
    if(!confirm(`مسح كل سجلات حضور «${m.name}» بتاريخ ${fmtDate(m.date)}؟ الاجتماع الأسبوعي نفسه سيبقى.`))return;
    db.attendance=db.attendance.filter(a=>a.meetingId!==id);
  } else {
    if(!confirm(`حذف اجتماع "${m.name}" وكل سجلات حضوره؟`))return;
    db.meetings=db.meetings.filter(x=>x.id!==id);db.attendance=db.attendance.filter(a=>a.meetingId!==id);
  }
  save();renderMeetingSelect();renderRoster();renderReports();renderDashboard();toast(m.type==='weekly'?'تم مسح سجلات الحضور':'تم حذف الاجتماع');
}
function download(filename,content,type='application/json;charset=utf-8'){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportBackup(){
  const payload={app:'خدمة ثانوي',...db,version:DATA_VERSION,exportedAt:new Date().toISOString()};
  download(`خدمة-ثانوي-نسخة-احتياطية-${today()}.json`,JSON.stringify(payload,null,2));toast('تم تجهيز النسخة الاحتياطية');
}
$('backupBtn').addEventListener('click',exportBackup);$('exportBackupBtn').addEventListener('click',exportBackup);
function refreshAll(){renderMeetingSelect();renderDashboard();renderStudents();renderRoster();renderReports();if(typeof refreshPlanViews==='function')refreshPlanViews();}
$('importBackupInput').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{const d=JSON.parse(await file.text());if(!Array.isArray(d.students)||!Array.isArray(d.meetings)||!Array.isArray(d.attendance))throw new Error('ملف غير صالح');
    if(!confirm('سيتم استبدال كل البيانات الحالية. هل تريد المتابعة؟')){e.target.value='';return;}
    db=migrate({students:d.students,meetings:d.meetings,attendance:d.attendance,servants:d.servants,settings:d.settings});attMeetingId=null;save();refreshAll();toast('تمت استعادة النسخة الاحتياطية');
  }catch(err){alert('تعذر استعادة الملف. تأكد أنه نسخة احتياطية صحيحة من خدمة ثانوي.');}
  e.target.value='';
});
$('resetDataBtn').addEventListener('click',()=>{
  if(!confirm('هل أنت متأكد؟ سيتم حذف التعديلات والاجتماعات والحضور والخدام والتوزيعات من هذا الجهاز وإعادة بيانات الشيت الأصلية.'))return;
  if(!confirm('تأكيد أخير: هل صدّرت نسخة احتياطية قبل إعادة الضبط؟'))return;
  db=migrate(freshData());attMeetingId=null;save();refreshAll();toast('تمت إعادة البيانات الأصلية');
});
function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"';}
$('exportCsvBtn').addEventListener('click',()=>{
  const {meetings,entries}=reportData();const rows=[['اسم المخدوم','النوع','الصف','نوع التعليم','الاجتماع','التاريخ','الحالة']];
  entries.forEach(a=>{const s=studentById(a.studentId),m=meetings.find(x=>x.id===a.meetingId);if(s&&m)rows.push([s.name,s.gender||'غير محدد',s.grade,s.education,m.name,m.date,statusLabel(a.status)]);});
  const csv='\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');download(`تقرير-حضور-خدمة-ثانوي-${today()}.csv`,csv,'text/csv;charset=utf-8');toast('تم تصدير التقرير');
});
window.addEventListener('storage',e=>{if(e.key&&e.key!==STORAGE_KEY)return;db=loadData();refreshAll();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ensureWeekly(db)){save();refreshAll();}});
$('statusFilter').value='active';
save();refreshAll();
