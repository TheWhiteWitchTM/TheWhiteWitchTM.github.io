import React from "react";
import {Button} from "@/components/ui/button";

export function GhostButton(
	{
		children,
	}: Readonly<{
	children: React.ReactNode;
}>) {
	return(
	<Button
			variant={"ghost"}
			className={"h-auto p-0"}
			asChild
		>
			{children}
    </Button>
	)
}