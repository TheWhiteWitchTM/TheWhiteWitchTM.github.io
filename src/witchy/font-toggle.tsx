"use client"

import { useState, useEffect } from "react"
import { WandSparkles, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";

interface FontToggleProps {
	defaultFontClass: string     // Celtic / your main font .className
	altFontClass: string         // clean / alternate .className
	labelCeltic?: string         // optional custom button text
	labelClean?: string
}

export function FontToggle({
	                           defaultFontClass,
	                           altFontClass,
	                           labelCeltic = "Celtic Font",
	                           labelClean = "Clean Font",
                           }: FontToggleProps) {
	const [usingAlt, setUsingAlt] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem("font-choice")
		const wantAlt = saved === "alt"

		const htmlEl = document.documentElement

		if (wantAlt) {
			htmlEl.classList.remove(defaultFontClass)
			htmlEl.classList.add(altFontClass)
			setUsingAlt(true)
		} else {
			htmlEl.classList.remove(altFontClass)
			htmlEl.classList.add(defaultFontClass)
			setUsingAlt(false)
		}
	}, [defaultFontClass, altFontClass])

	const toggleFont = () => {
		const htmlEl = document.documentElement
		const nextAlt = !usingAlt

		if (nextAlt) {
			htmlEl.classList.remove(defaultFontClass)
			htmlEl.classList.add(altFontClass)
			localStorage.setItem("font-choice", "alt")
		} else {
			htmlEl.classList.remove(altFontClass)
			htmlEl.classList.add(defaultFontClass)
			localStorage.setItem("font-choice", "default")
		}

		setUsingAlt(nextAlt)
	}

	return (
		<SimpleTooltip
			text={"Toggles between a normal font and my pick"}
		>
		<Button
			variant="ghost"
			size="sm"
			className={"h-auto p-0"}
			onClick={toggleFont}
		>
			{usingAlt ? <WandSparkles/> : <Type/>}
		</Button>
		</SimpleTooltip>
	)
}