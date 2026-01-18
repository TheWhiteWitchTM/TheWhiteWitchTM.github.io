export const dynamic = 'force-static';  // <-- slap this right at the top, before the function

// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: '/',
		name: 'The White Witch™ Coven',
		short_name: 'WhiteWitch',
		description: 'Snark, spells, deployment curses, and zero ads.',
		start_url: '/',
		display: 'standalone',
		background_color: '#111111',
		theme_color: '#00cc66',
		icons: [
			{
				src: '/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'maskable',
			},
		],
	};
}