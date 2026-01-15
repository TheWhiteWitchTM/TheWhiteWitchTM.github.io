import Image from "next/image";
import {Github, Mailbox, Twitter, Youtube} from "lucide-react";

export default function AsideRight() {
	return (
		<div>
			<div className={"mb-4"}>
				Links
			</div>
			<div className={"flex flex-col gap-3"}>
				<Youtube/><Twitter/><Github/><Mailbox/>
			</div>
		</div>
	)
}