"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {SimpleTooltip} from "@/witchy/ui/SimpleTooltip";
import { Download } from "lucide-react"; // ← Import the icon here

export function InstallButton() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	const isPWAInstalled = () => {
		const mediaStandalone = window.matchMedia("(display-mode: standalone)").matches;
		const mediaFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
		const mediaMinimal = window.matchMedia("(display-mode: minimal-ui)").matches;
		const iosStandalone = "standalone" in navigator && (navigator as any).standalone;

		return mediaStandalone || mediaFullscreen || mediaMinimal || iosStandalone;
	};

	useEffect(() => {
		if (isPWAInstalled()) {
			setIsInstallable(false);
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setIsInstallable(true);
		};

		window.addEventListener("beforeinstallprompt", handler as EventListener);

		const onInstalled = () => {
			setIsInstallable(false);
			setDeferredPrompt(null);
		};
		window.addEventListener("appinstalled", onInstalled);

		// Cleanup
		return () => {
			window.removeEventListener("beforeinstallprompt", handler as EventListener);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		(deferredPrompt as any).prompt();

		const { outcome } = await (deferredPrompt as any).userChoice;

		if (outcome === "accepted") {
			console.log("PWA install accepted ✨");
		} else {
			console.log("PWA install dismissed");
		}

		setDeferredPrompt(null);
		setIsInstallable(false); // Hide immediately after interaction
	};

	//if (!isInstallable) return null;

	return (
		<SimpleTooltip
			text={"Install the app"}
			side={"bottom"}
		>
		<Button
			variant="outline"
			onClick={handleInstall}
			size="icon"          // Makes it icon-only sized (square)
			aria-label="Install App" // Good for accessibility
			className={"h-auto p-0"}
		>
			<Download/>
		</Button>
		</SimpleTooltip>
	);
}