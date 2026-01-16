'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GreeterProps {
	children: React.ReactNode;
}

export default function Greeter({ children }: GreeterProps) {
	const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const stored = localStorage.getItem('user-consent') as 'accepted' | 'declined' | null;
		setConsent(stored);
	}, []);

	if (!isMounted) {
		return (
			<div className="min-h-screen flex items-center justify-center text-muted-foreground">
				Awakening the portal...
			</div>
		);
	}

	const handleAccept = () => {
		localStorage.setItem('user-consent', 'accepted');
		setConsent('accepted');
	};

	const handleDecline = () => {
		localStorage.setItem('user-consent', 'declined');
		setConsent('declined');
	};

	if (consent === null) {
		// Show greeter full-screen until decision
		return (
			<main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
				<div className="max-w-lg w-full text-center space-y-10">
					<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
						🧙‍♀️ Welcome, Wanderer
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
						The veils between realms part only for those who consent.
						Local echoes (storage) and visions from afar (YouTube) await...
					</p>

					<Dialog open={true} onOpenChange={() => {}}>
						<DialogContent
							className="sm:max-w-md border-2 border-primary/40 shadow-2xl backdrop-blur-sm bg-background/95 [&>button]:hidden"
						>
							<DialogHeader>
								<DialogTitle className="text-3xl font-bold">Shall we proceed?</DialogTitle>
								<DialogDescription className="pt-4 text-base leading-relaxed">
									Accept to summon the intro vision and full magic.
									Decline and walk the silent path — no traces left behind.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="flex flex-col sm:flex-row gap-5 pt-8 sm:justify-center">
								<Button
									variant="outline"
									size="lg"
									onClick={handleDecline}
									className="w-full sm:w-auto text-lg py-6"
								>
									Decline (Silent Path)
								</Button>
								<Button
									size="lg"
									onClick={handleAccept}
									className="w-full sm:w-auto text-lg py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
								>
									Accept & Cross the Veil ✨
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</main>
		);
	}

	if (consent === 'declined') {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-10">
				<h2 className="text-5xl font-bold text-muted-foreground">The Silent Path</h2>
				<p className="text-2xl max-w-md text-muted-foreground/80 leading-relaxed">
					No visions summoned, no echoes stored.
					The realm remains quiet in your presence.
				</p>
				<Button
					variant="outline"
					size="lg"
					onClick={() => {
						localStorage.removeItem('user-consent');
						window.location.reload();
					}}
					className="text-lg py-6 px-10"
				>
					Reconsider My Choice
				</Button>
			</main>
		);
	}

	// Accepted → render the wrapped content (your page)
	return <>{children}</>;
}