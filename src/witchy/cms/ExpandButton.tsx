/// src/witchy/cms/ExpandButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

type Props = {
	slug: string
}

export default function ExpandButton({ slug }: Props) {
	const [visible, setVisible] = useState(false)
	const [expanded, setExpanded] = useState(false)

	useEffect(() => {
		// Delay slightly to ensure DOM is fully rendered
		const timer = setTimeout(() => {
			const wrapper = document.querySelector(`#content-wrapper-${slug}`)

			if (!wrapper) {
				console.warn(`Wrapper not found for slug: ${slug}`)
				return
			}

			const overflowing = wrapper.scrollHeight > wrapper.clientHeight + 10
			setVisible(overflowing)
		}, 100) // small delay helps with hydration timing

		return () => clearTimeout(timer)
	}, [slug])

	const toggle = () => {
		const wrapper = document.querySelector(`#content-wrapper-${slug}`)
		if (!wrapper) return

		const nowExpanded = !expanded
		setExpanded(nowExpanded)

		if (nowExpanded) {
			wrapper.classList.remove('max-h-[200px]', 'overflow-hidden')
			wrapper.querySelector('[data-fade]')?.classList.add('hidden')
		} else {
			wrapper.classList.add('max-h-[200px]', 'overflow-hidden')
			wrapper.querySelector('[data-fade]')?.classList.remove('hidden')
		}
	}

	if (!visible) return null

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all hover:scale-105"
						onClick={toggle}
					>
						{expanded ? '↑' : '↓'}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="right">
					{expanded ? 'Show less' : 'Read more'}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}