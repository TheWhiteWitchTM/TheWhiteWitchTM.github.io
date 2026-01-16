import Image from "next/image";
import Link from "next/link";

export default function AsideLeft() {
	return (
		<div className={"flex flex-col"}>
			<div className={"flex flex-row"}>
				<Image
					src="/logo.jpg"
					alt="TheWhiteWitchTM Logo"
					width={64}
					height={64}
				/>
				<div className={"font-bold mt-1.5"}>
					Menu✨
				</div>
			</div>
			<div className={"flex flex-col ml-8 mt-2 gap-1"}>
				<Link href={"/"}>
					🛖Home
				</Link>
				<Link href={"/blog"}>
					📖Blog
				</Link>
			</div>

		</div>
	)
}