// ServiceWorkerRegistration.jsx  (or put this in your App.jsx / main.jsx)
import { useEffect } from 'react';

export default function PWARegister() {
	useEffect(() => {
		// Only run in production / when service workers are supported
		if ('serviceWorker' in navigator) {
			// Wait for the page to fully load before registering (best practice)
			window.addEventListener('load', () => {
				const swUrl = '/sw.js';

				navigator.serviceWorker
					.register(swUrl)
					.then((registration) => {
						console.log('Service Worker registered with scope:', registration.scope);

						// Optional: Listen for updates (e.g. new version available)
						registration.onupdatefound = () => {
							const installingWorker = registration.installing;
							if (installingWorker == null) return;

							installingWorker.onstatechange = () => {
								if (installingWorker.state === 'installed') {
									if (navigator.serviceWorker.controller) {
										// New content available → you could show a toast/notification
										console.log('New content is available; please refresh.');
									} else {
										console.log('Content is cached for offline use.');
									}
								}
							};
						};
					})
					.catch((error) => {
						console.error('Service Worker registration failed:', error);
					});
			});
		}
	}, []); // Empty dependency array → runs once on mount

	return null; // This component doesn't render anything visible
}