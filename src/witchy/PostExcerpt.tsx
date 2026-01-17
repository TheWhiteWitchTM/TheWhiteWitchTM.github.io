'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'   // ← add these imports
import { cn } from '@/lib/utils'

interface PostExcerptProps {
	children: React.ReactNode
	previewHeight?: string       // e.g. '10rem' or '12rem' — tune to ~5 lines
	minContentHeightToShowButton?: number   // px — e.g. 220 to skip short posts
	className?: string
	gradient?: boolean
}

export function PostExcerpt({
	                            children,
	                            previewHeight = '10rem',
	                            minContentHeightToShowButton = 220,
	                            className,
	                            gradient = true,
                            }: PostExcerptProps) {
	const [expanded, setExpanded] = useState(false)
	const [isLong, setIsLong] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const checkHeight = () => {
			const el = contentRef.current
			if (!el) return

			const prevMax = el.style.maxHeight
			el.style.maxHeight = ''

			const naturalPx = el.scrollHeight
			const limitPx = parseFloat(previewHeight) || 160

			const reallyLong = naturalPx > limitPx + 20 && naturalPx > minContentHeightToShowButton

			setIsLong(reallyLong)

			el.style.maxHeight = prevMax
		}

		checkHeight()
		window.addEventListener('resize', checkHeight)
		const timer = setTimeout(checkHeight, 400)
		return () => {
			window.removeEventListener('resize', checkHeight)
			clearTimeout(timer)
		}
	}, [children, previewHeight, expanded])

	return (
		<div className={cn('relative isolate', className)}>
			<div
				ref={contentRef}
				className="overflow-hidden transition-[max-height] duration-300 ease-out"
				style={{
					maxHeight: expanded ? 'none' : previewHeight,
				}}
			>
				{children}
			</div>

			{gradient && isLong && !expanded && (
				<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
			)}

			{isLong && (
				<div className="mt-6 flex justify-center min-h-[3rem] items-center">
					<Button
						variant={expanded ? "outline" : "default"}   // ← "default" (filled) for Read more = more prominent
						size="sm"
						onClick={() => setExpanded(!expanded)}
						className="gap-1.5 px-5 py-2"   // a bit wider + padding
					>
						{expanded ? (
							<>
								Show less
								<ChevronUp className="h-4 w-4" />
							</>
						) : (
							<>
								Read more
								<ChevronDown className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	)
}