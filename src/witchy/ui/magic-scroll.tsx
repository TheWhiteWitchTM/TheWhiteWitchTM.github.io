"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MagicScrollProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	triggerText?: string
	defaultOpen?: boolean
	className?: string
	contentClassName?: string
	noBlur?: boolean
}

const MagicScroll = React.forwardRef<HTMLDivElement, MagicScrollProps>(
	(
		{
			children,
			triggerText = "Unroll the ancient scroll…",
			defaultOpen = false,
			className,
			contentClassName,
			noBlur = false,
			...props
		},
		ref
	) => {
		const [isOpen, setIsOpen] = React.useState(defaultOpen)

		return (
			<div
				ref={ref}
				className={cn(
					"relative mx-auto w-full max-w-3xl select-none",
					className
				)}
				{...props}
			>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						"group relative flex w-full items-center justify-center overflow-hidden",
						"rounded-t-xl border border-amber-900/30 bg-gradient-to-b from-amber-100 to-amber-300",
						noBlur ? "" : "backdrop-blur-sm",
						"px-6 py-8 text-center font-serif text-lg md:text-xl font-medium text-amber-950",
						"shadow-md transition-all hover:shadow-lg active:scale-[0.99]",
						"cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
					)}
					aria-expanded={isOpen}
				>
          <span className="relative z-10">
            {isOpen ? "Close the scroll ↑" : triggerText}
          </span>
					<span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-60 pointer-events-none" />
				</button>

				<div
					className={cn(
						"origin-top overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
						isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
						"rounded-b-xl border-x border-b border-amber-900/20 bg-gradient-to-b from-amber-50 via-amber-100/80 to-amber-50",
						"shadow-2xl shadow-amber-950/20",
						contentClassName
					)}
				>
					<div className="relative px-8 py-12 md:px-16 md:py-20">
						<div className="pointer-events-none absolute inset-0 shadow-[inset_0_12px_24px_-8px_rgba(0,0,0,0.2)]" />
						<div className="pointer-events-none absolute inset-0 shadow-[0_0_40px_rgba(139,69,19,0.15)]" />
						<div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply bg-[radial-gradient(#8b4513_1px,transparent_1px)] [background-size:24px_24px]" />

						<div className="relative z-10 prose prose-amber max-w-none font-serif text-amber-950 leading-relaxed text-lg">
							{children}
						</div>
					</div>
				</div>
			</div>
		)
	}
)

MagicScroll.displayName = "MagicScroll"

export { MagicScroll }