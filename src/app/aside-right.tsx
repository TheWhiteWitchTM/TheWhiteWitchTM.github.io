import Image from "next/image";
import {Github, Mailbox, Twitter, Youtube} from "lucide-react";
import {ThemeToggle} from "@/witchy/theme-toggle";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {GhostButton} from "@/witchy/ui/GhostButton";
import Link from "next/link";

export default function AsideRight() {
	return (
		<div className={"flex flex-col gap-2"}>
			<ThemeToggle/>
			<Separator/>
			<GhostButton>
				<Link
					href={"https://www.youtube.com/@TheWhiteWitchTM"}
					target={"_blank"}
				>
					<Youtube/>
				</Link>
			</GhostButton>
				<GhostButton>
					<Link
						href={"https://x.com/thewhitewitchtm"}
						target={"_blank"}>
					<Twitter/>
					</Link>
				</GhostButton>
				<GhostButton>
					<Link
						href={"https://github.com/TheWhiteWitchTM"}
						target={"_blank"}
					>
						<Github/>
					</Link>
				</GhostButton>
				<Separator/>
				<GhostButton>
					<Link href={"mailto://thewhitewitchtm@gmail.com"}>
						<Mailbox/>
					</Link>
				</GhostButton>
		</div>
	)
}