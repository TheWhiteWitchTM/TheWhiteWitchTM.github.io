import type { Metadata } from "next";
import { UnifrakturCook } from 'next/font/google';
import "./globals.css";
import {ThemeProvider} from "@/witchy/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google'
import AsideRight from "@/witchy/home/aside-right";
import AsideLeft from "@/witchy/home/aside-left";
import {Header} from "@/witchy/home/header";
import {Footerr} from "@/witchy/home/footerr";
import Greeter from "@/witchy/home/greeter";

const witchFont = UnifrakturCook({
	weight: '700',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
  title: "🧙‍♀️𝕿𝖍𝖊 𝖂𝖍𝖎𝖙𝖊 𝖂𝖎𝖙𝖈𝖍™✨",
  description: "🧙‍♀️𝕿𝖍𝖊 𝖂𝖍𝖎𝖙𝖊 𝖂𝖎𝖙𝖈𝖍™✨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	  <html lang="en" className={witchFont.className} suppressHydrationWarning>
    <body className="min-h-screen li bg-gray-200 dark:bg-gray-700 antialiased">
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
    </body>
    </html>
  );
}