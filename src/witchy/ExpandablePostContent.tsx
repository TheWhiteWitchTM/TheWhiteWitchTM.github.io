// src/components/ExpandablePostContent.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
	Content: React.ComponentType
	maxPreviewLines?: number   // default 5–7 ≈ roughly 200–350 chars of text
}

export default function ExpandablePostContent({
	                                              Content,
	                                              maxPreviewLines = 6,
                                              }: Props) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [needsTruncation, setNeedsTruncation] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = contentRef.current
		if (el) {
			// +2 is a small buffer for sub-pixel / rounding differences
			setNeedsTruncation(el.scrollHeight > el.clientHeight + 2)
		}
	}, [Content]) // re-evaluate if Content changes (rare)

	return (
		<div className="relative">
			<div
				ref={contentRef}
				className={`
          prose prose-lg dark:prose-invert max-w-none
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? '' : `line-clamp-[${maxPreviewLines}]`}
        `}
			>
				<Content />
			</div>

			{/* Fade-out gradient when truncated */}
			{!isExpanded && needsTruncation && (
				<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
			)}

			{/* Button only appears if this individual post is actually long */}
			{needsTruncation && (
				<div className="mt-6 flex justify-center sm:justify-start">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
						className="gap-2"
					>
						{isExpanded ? (
							<>
								Show less <ChevronUp className="h-4 w-4" />
							</>
						) : (
							<>
								Read more <ChevronDown className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	)
}