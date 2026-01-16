import Image from "next/image";
import {Github, Mailbox, Twitter, Youtube} from "lucide-react";
import {ThemeToggle} from "@/witchy/theme-toggle";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

export default function AsideRight() {
	return (
		<div className={"flex flex-col gap-2"}>
				<ThemeToggle/>
				<Separator/>
				<Button variant={"ghost"} className={"h-auto p-0"}>
					<Youtube/>
				</Button>
			<Button variant={"ghost"} className={"h-auto p-0"}>
				<Twitter/>
			</Button>
				<Button variant={"ghost"} className={"h-auto p-0"}>
					<Github/>
				</Button>
				<Separator/>
				<Button variant={"ghost"} className={"h-auto p-0"}>
					<Mailbox/>
				</Button>
		</div>
	)
}