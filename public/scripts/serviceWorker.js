const addResourcesToCache = async (resources) => {
    const cache = await caches.open("rrtbl-beta");
    await cache.addAll(resources);
};

self.addEventListener("fetch", fetchEvent => {
    const url = new URL(fetchEvent.request.url);
    console.log(url);
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/index.html",
            "/style.css",
            "/skeli.css",
            "/scripts/refrences.js",
            "/scripts/additional.js",
            "/scripts/script.js",
            "/classes/3/B/odd.json",
        ]),
    );
});

self.addEventListener('activate', event => {
    console.log('V1 now ready to handle fetches!');

    clients.claim();
});
