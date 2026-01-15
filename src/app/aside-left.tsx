import Image from "next/image";

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
			<div className={"flex flex-col ml-8 mt-2 gap-3"}>
				🛖Home
			</div>

		</div>
	)
}