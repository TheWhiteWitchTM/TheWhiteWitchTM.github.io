"use client"

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

interface SimpleTooltipProps {
	children: React.ReactNode
	text: string
	side?: "top" | "right" | "bottom" | "left"
	delayDuration?: number
}

export function SimpleTooltip({
	                              children,
	                              text,
	                              side = "top",
	                              delayDuration = 300,
                              }: SimpleTooltipProps) {
	return (
		<TooltipProvider delayDuration={delayDuration}>
			<Tooltip>
				<TooltipTrigger asChild>
					{children}
				</TooltipTrigger>
				<TooltipContent className={"z-50"} side={side}>
					{text}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}