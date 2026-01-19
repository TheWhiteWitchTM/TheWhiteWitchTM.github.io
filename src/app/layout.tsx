import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "@/witchy/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google'
import AsideRight from "@/witchy/home/aside-right";
import AsideLeft from "@/witchy/home/aside-left";
import {Header} from "@/witchy/home/header";
import {Footerr} from "@/witchy/home/footerr";
import Greeter from "@/witchy/home/greeter";
import PwaRegister from "@/witchy/PwaRegister";

export const metadata: Metadata = {
  title: "🧙‍♀️𝕿𝖍𝖊 𝖂𝖍𝖎𝖙𝖊 𝖂𝖎𝖙𝖈𝖍™✨",
  description: "🧙‍♀️𝕿𝖍𝖊 𝖂𝖍𝖎𝖙𝖊 𝖂𝖎𝖙𝖈𝖍™✨",
	manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	  <html lang="en"
	        className="scrollbar scrollbar-thumb-[#B22222] scrollbar-track-[#0f0c1a] scrollbar-thin"
	        suppressHydrationWarning
	  >
    <body className={"min-h-screen antialiased className=\"scrollbar scrollbar-thumb-[#B22222] scrollbar-track-[#0f0c1a] scrollbar-thin"}>
		<PwaRegister/>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <div className="flex w-w-full min-h-screen flex-col">
				<Header/>
	      <Greeter>
	      <div className="flex-grow">
		      <div className={"grid grid-cols-[auto_1fr_auto]"}>
			      <div>
				      <AsideLeft/>
			      </div>
			      <main className="w-full">
				      {children}
			      </main>
			      <div className={"mr-1"}>
				      <AsideRight/>
			      </div>
		      </div>
	      </div>
				</Greeter>
	      <Footerr/>
      </div>
    </ThemeProvider>
    <GoogleAnalytics gaId="G-520311503" />
		<PwaRegister/>
    </body>
    </html>
  );
}