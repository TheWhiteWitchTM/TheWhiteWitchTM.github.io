// src/components/PwaRegister.tsx
'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
	useEffect(() => {
		// Only run in production / real domain
		if (
			typeof window !== 'undefined' &&
			'serviceWorker' in navigator &&
			process.env.NODE_ENV === 'production' &&
			!location.hostname.includes('localhost')
		) {
			window.addEventListener('load', () => {
				navigator.serviceWorker
					.register('/sw.js')
					.then((reg) => {
						console.log('Service Worker registered — finally no greeter bullshit 🔮', reg.scope);
					})
					.catch((err) => {
						console.error('Service Worker registration cursed:', err);
					});
			});
		}
	}, []);

	return null; // This component renders nothing visible
}