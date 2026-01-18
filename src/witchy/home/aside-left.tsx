import Link from "next/link";
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";

export default function AsideLeft() {
	return (
		<div className={"sticky top-14 flex flex-col"}>
			<div className={"flex flex-col mt-2 gap-1"}>
				<SimpleTooltip
					text={"Visit my home, I do not bite (mostly)"}
					side={"right"}
				>
				<Link href={"/"}>
					🛖Home
				</Link>
				</SimpleTooltip>
				<SimpleTooltip
					text={"Stay up to date, with Witchy!"}
					side={"right"}
				>
				<Link href={"/blog"}>
					📖Blog
				</Link>
					</SimpleTooltip>
			</div>

		</div>
	)
}