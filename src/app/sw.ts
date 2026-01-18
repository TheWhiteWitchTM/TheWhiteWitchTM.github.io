// src/app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";  // <-- THIS is the right one, no /sw

// Declare the injection point for TypeScript (stops red squiggles & build errors)
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: defaultCache,
	// Optional: add if you create an offline fallback page later
	// fallbacks: {
	//   entries: [
	//     {
	//       matcher({ request }) {
	//         return request.destination === "document";
	//       },
	//       url: "/~offline",
	//     },
	//   ],
	// },
});

serwist.addEventListeners();