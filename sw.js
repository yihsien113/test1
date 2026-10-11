const CACHE_NAME = 'dollhouse-game-v2';

// 填寫與 index.html 同目錄下的檔案檔名
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'assets/icon.webp',
  'assets/lobby/lobby.webp',
  'assets/wardrobe/wardrobe.webp',
  'assets/map/map1.webp',
  'assets/map/map2.webp',
  'assets/han/han1-1.webp',
  'assets/han/han1-2.webp',
  'assets/han/han1-3.webp',
  'assets/han/han2-1.webp',
  'assets/han/han2-2.webp',
  'assets/han/han2-3.webp',
  'assets/han/han3-1.webp',
  'assets/han/han3-2.webp',
  'assets/han/han3-3.webp',
  'assets/bad/bad1-1.webp',
  'assets/bad/bad1-2.webp',
  'assets/bad/bad1-3.webp',
  'assets/bad/bad2.webp'
];

// 安裝並預載
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[PWA] 開始預載檔案...');
      // 逐一加進快取，若有檔案找不到會在 Console 印出詳細錯在哪個檔
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
          console.log(`[PWA] 成功預載: ${asset}`);
        } catch (err) {
          console.error(`❌ [PWA] 預載失敗，請檢查此檔案是否存在或檔名大小寫: ${asset}`, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 啟動與清理舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截請求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});