import React from "react";
import Image from "next/image";
import {ThemeToggle} from "@/witchy/theme-toggle";
import {FontToggle} from "@/witchy/font-toggle";
import {UnifrakturCook, Geist} from "next/font/google";
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";
import {InstallButton} from "@/witchy/nstallButton";

const witchFont = UnifrakturCook({
	weight: '700',
	subsets: ['latin'],
	display: 'swap',
});

const geistFont = Geist({
	weight: '700',
	subsets: ['latin'],
	display: 'swap',
});

export function Header() {

	return(
		<div className={"z-50 sticky top-0 w-full bg-background overflow-hidden"}>
			<div className={"grid grid-cols-[auto_1fr]"}>
				<div className="bg-transparent">
					<SimpleTooltip
						text={"HEY YOU!"}
						side={"bottom"}
					>
					<Image
						src="/logo.png"
						alt="TheWhiteWitchTM Logo"
						width={100}
						height={100}
					/>
					</SimpleTooltip>
				</div>
				<div>
					<div className={"grid grid-cols-[1fr_auto]"}>
						<div>
							🧙‍♀️𝕿𝖍𝖊 𝖂𝖍𝖎𝖙𝖊 𝖂𝖎𝖙𝖈𝖍™✨
						</div>
						<div className={"flex flex-row"}>
							<InstallButton/>
							<FontToggle
								defaultFontClass={geistFont.className}
								altFontClass={witchFont.className}
							/>
							<ThemeToggle/>
						</div>
					</div>
					<code>
						<SimpleTooltip
							text={"Working on scripts about X and Musk!"}
							side={"bottom"}
						>
						<center>
							👉🏼FEATURED: X censorship!✨
						</center>
						</SimpleTooltip>
					</code>
				</div>
				</div>
			</div>
	)
}