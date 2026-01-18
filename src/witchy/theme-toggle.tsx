"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<SimpleTooltip
			text={"Toggle between light and dark mode"}
		>
		<Button
			variant="ghost"
			className={"h-auto p-0"}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
			</SimpleTooltip>
	)
}