// Scope follows the script URL, so /mira/sw.js covers /mira/.
const BASE = new URL('./', self.location).pathname

const CACHE_NAME = 'mirasworld-cache-v2'
const STATIC_ASSETS = [
	BASE,
	`${BASE}icon.svg`,
	`${BASE}favicon.ico`,
	`${BASE}icon-192x192.png`,
	`${BASE}banner.jpg`,
]

self.addEventListener('install', (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME)
		await Promise.all(STATIC_ASSETS.map(async (url) => {
			try {
				await cache.add(url)
			} catch {
				// A missing asset should not block install.
			}
		}))
		await self.skipWaiting()
	})())
})

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		const keys = await caches.keys()
		await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
		await self.clients.claim()
	})())
})

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url)
	if (event.request.method !== 'GET' || url.origin !== self.location.origin) return
	if (!url.pathname.startsWith(BASE)) return

	event.respondWith((async () => {
		const cached = await caches.match(event.request)
		if (cached) return cached
		try {
			const response = await fetch(event.request)
			if (response && response.status === 200 && response.type === 'basic') {
				const copy = response.clone()
				const cache = await caches.open(CACHE_NAME)
				await cache.put(event.request, copy)
			}
			return response
		} catch {
			return (await caches.match(BASE)) || Response.error()
		}
	})())
})
