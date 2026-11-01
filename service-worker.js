/* خدمة ثانوي — Service Worker
   يخزّن ملفات التطبيق فقط (HTML/CSS/JS/الأيقونات). لا يلمس localStorage ولا بيانات المستخدم. */
const VERSION = 'v1';
const CACHE = 'khedmet-thanawy-shell-' + VERSION;
const SHELL = [
  './', './index.html', './style.css', './redesign.css', './ui.js', './app.js', './plan.js',
  './pdf.js', './pdf-assets.js', './manifest.webmanifest',
  './assets/logo-khedmet-thanawy.png', './assets/logo-khedmet-thanawy-sm.png',
  './assets/icon-192.png', './assets/pwa-icon-192.png', './assets/pwa-icon-512.png',
  './assets/pwa-icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // نضيف كل ملف على حدة حتى لا يفشل التثبيت كله بسبب ملف واحد
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('khedmet-thanawy-shell-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // لا نخزّن أي طرف ثالث (مثل Google Fonts)
  // Stale-while-revalidate: يفتح فورًا من الكاش ويحدّث في الخلفية، فلا تبقى نسخة قديمة للأبد
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(hit => {
        const net = fetch(req).then(res => {
          if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
          return res;
        }).catch(() => hit || (req.mode === 'navigate' ? cache.match('./index.html') : undefined));
        return hit || net;
      })
    )
  );
});
