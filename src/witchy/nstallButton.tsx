"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // adjust path if needed

export function InstallButton() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	// Check if currently running as installed PWA (standalone / fullscreen / minimal-ui)
	const isPWAInstalled = () => {
		const mediaStandalone = window.matchMedia("(display-mode: standalone)").matches;
		const mediaFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
		const mediaMinimal = window.matchMedia("(display-mode: minimal-ui)").matches;
		const iosStandalone = "standalone" in navigator && (navigator as any).standalone;

		return mediaStandalone || mediaFullscreen || mediaMinimal || iosStandalone;
	};

	useEffect(() => {
		// Don't show if already in standalone mode
		if (isPWAInstalled()) {
			setIsInstallable(true);
			return;
		}

		let promptHandler: (e: Event) => void;

		const handler = (e: Event) => {
			// Prevent the mini-infobar (e.g. Chrome's default banner)
			e.preventDefault();
			// Store the event so we can trigger .prompt() later
			setDeferredPrompt(e);
			setIsInstallable(true);
		};

		window.addEventListener("beforeinstallprompt", handler as EventListener);
		promptHandler = handler as EventListener;

		// Also hide if the app gets installed while the page is open
		const onInstalled = () => {
			setIsInstallable(false);
			setDeferredPrompt(null);
		};
		window.addEventListener("appinstalled", onInstalled);

		// Initial check (in case loaded directly in standalone)
		if (isPWAInstalled()) {
			setIsInstallable(false);
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", promptHandler);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install dialog
		(deferredPrompt as any).prompt();

		// Wait for user choice
		const { outcome } = await (deferredPrompt as any).userChoice;

		if (outcome === "accepted") {
			console.log("PWA install accepted ✨");
			setIsInstallable(false);
		} else {
			console.log("PWA install dismissed");
		}

		// Clean up (can only prompt once per event)
		setDeferredPrompt(null);
	};

	//if (!isInstallable) return null;

	return (
		<Button variant="outline" onClick={handleInstall} className="gap-2">
			Install App ✨
			{/* Optional: add a small icon if you have lucide-react installed */}
			{/* <Download className="h-4 w-4" /> */}
		</Button>
	);
}