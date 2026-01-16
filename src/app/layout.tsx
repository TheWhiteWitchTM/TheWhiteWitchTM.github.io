import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import {ThemeProvider} from "@/witchy/theme-provider";
import AsideRight from "@/app/aside-right";
import AsideLeft from "@/app/aside-left";


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
	  <html lang="en" suppressHydrationWarning>
    <body>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <div className="relative w-full h-[100px] overflow-hidden bg-gray-900">
	      <Image
		      src="/banner.jpg"           // ← your uploaded image (can be much larger/taller/wider)
		      alt="Profile banner"
		      fill
		      className="object-cover object-center"  // ← this is the magic: crops + centers
		      priority                                // optional: if it's above the fold
		      quality={85}                            // balance quality vs file size
	      />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 p-4">
	      <aside>
		      <AsideLeft/>
	      </aside>
	      <main className="mx-auto max-w-[400px] px-4 sm:px-6 lg:px-8">
		      <article className="prose prose-slate lg:prose-lg mx-auto">
			      {children}
		      </article>
	      </main>
	      <aside>
		      <AsideRight/>
	      </aside>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}