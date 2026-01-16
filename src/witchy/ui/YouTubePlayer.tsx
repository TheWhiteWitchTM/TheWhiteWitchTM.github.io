'use client';

import { useMemo } from 'react';
import {YouTubeEmbed} from "@next/third-parties/google";

interface YouTubePlayerProps {
	urlOrId: string;
	title?: string;
	autoplay?: boolean;
	muted?: boolean;
	loop?: boolean;
	controls?: boolean;
	className?: string;
}

export default function YouTubePlayer({
	                                      urlOrId,
	                                      title = 'YouTube video',
	                                      autoplay = false,
	                                      muted = true,
	                                      loop = false,
	                                      controls = true,
	                                      className = '',
                                      }: YouTubePlayerProps) {
	const videoId = useMemo(() => {
		const input = urlOrId.trim();

		// Direct 11-char ID
		if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
			return input;
		}

		// Extract from various URL formats (ignores ?si=, &t=, etc.)
		const match = input.match(
			/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|v\/|shorts\/|.+\?v=))([a-zA-Z0-9_-]{11})/i
		);

		return match ? match[1] : null;
	}, [urlOrId]);

	if (!videoId) {
		return (
			<div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg border text-muted-foreground">
				Invalid YouTube link or ID
			</div>
		);
	}

	const params = new URLSearchParams({
		autoplay: autoplay ? '1' : '0',
		mute: muted ? '1' : '0',
		loop: loop ? '1' : '0',
		playlist: loop ? videoId : '',
		controls: controls ? '1' : '0',
		modestbranding: '1',
		rel: '0',
		showinfo: '0',
		playsinline: '1',
	}).toString();

	return (
		<div
			className={`relative w-full overflow-hidden rounded-xl border border-border/50 shadow-lg ${className}`}
		>
			<YouTubeEmbed
				videoid={videoId}
			/>
		</div>
	);
}