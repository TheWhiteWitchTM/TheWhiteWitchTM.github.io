import {Github, Mailbox, Twitter, Youtube} from "lucide-react";
import {BluSsky} from "@/witchy/home/BlueSky";
import {Separator} from "@/components/ui/separator";
import {GhostButton} from "@/witchy/ui/GhostButton";
import Link from "next/link";
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";

export default function AsideRight() {
	return (
		<div className={"sticky top-18"}>
			<div className={"mt-3 flex flex-col gap-2"}>
			<SimpleTooltip
				text={"Check out my YouTube!"}
				side={"left"}
			>
				<GhostButton>
					<Link
						href={"https://www.youtube.com/@TheWhiteWitchTM"}
						target={"_blank"}
					>
						<Youtube/>
					</Link>
				</GhostButton>
			</SimpleTooltip>
			<SimpleTooltip
				text={"Visit my BlueSky!"}
				side={"left"}
			>
			<GhostButton>
				<Link
					href={"https://bsky.app/profile/thewhitewitchtm.bsky.social"}
					target={"_blank"}>
					<BluSsky/>
				</Link>
			</GhostButton>
			</SimpleTooltip>
			<SimpleTooltip
				text={"For me X is still Twittter! X sucks!"}
				side={"left"}
			>
			<GhostButton>
					<Link
						href={"https://x.com/thewhitewitchtm"}
						target={"_blank"}>
					<Twitter/>
					</Link>
				</GhostButton>
			</SimpleTooltip>
			<SimpleTooltip
				text={"I am on GitHub! Check my code out."}
				side={"left"}
			>
				<GhostButton>
					<Link
						href={"https://github.com/TheWhiteWitchTM"}
						target={"_blank"}
					>
						<Github/>
					</Link>
				</GhostButton>
				</SimpleTooltip>
				<Separator/>
			<SimpleTooltip
				text={"EMail Contact, Business only please!!"}
				side={"left"}
			>
				<GhostButton>
					<Link href={"mailto://thewhitewitchtm@gmail.com"}>
						<Mailbox/>
					</Link>
				</GhostButton>
				</SimpleTooltip>
		</div>
		</div>
	)
}