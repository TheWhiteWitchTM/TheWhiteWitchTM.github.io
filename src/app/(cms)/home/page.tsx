import { readdir } from "fs/promises";
import {PostExcerpt} from "@/witchy/PostExcerpt";
import {Post} from "@/witchy/cms/types"
import {sortPostsNewest} from "@/witchy/cms/sort";
import {Separator} from "@/components/ui/separator";
import {BannerImage} from "@/witchy/ui/banner-image";
import {MagicScroll} from "@/witchy/ui/magic-scroll";

const category = "home";
const path = "/src/app/(cms)/"+category+"/(posts)/"

async function getPosts(path: string) {
	const slugs = (
		await readdir(process.cwd()+path, { withFileTypes: true })
	).filter((dirent) => dirent.isDirectory());

	return await Promise.all(
		slugs.map(async ({ name }) => {
			const mod= await import("./(posts)/"+name+"/page.mdx");
			const post:Post = {
				Content:mod.default,
				slug: name,
				metadata: mod.metadata,
			}
			return post;
		})
	);
}

export default async function () {
	let posts = await getPosts(path)
	sortPostsNewest(posts)
	return (
		<div className={"w-full justify-center justify-items-center"}>
			<div className={"min-w-1/2 max-w-5/6 flex flex-col gap-3 m-3 p-3"}>
				<BannerImage>
					<BannerImage.Image
						src="banner.jpg"
						alt="Cozy witch brewing coffee"
					/>
					<BannerImage.Banner className="rounded-full">
						<div className="
						-py-10 opacity-90 inline-blockrounded-2xl
						bg-black/70  border border-white/10
						shadow-2xl shadow-black/50
						text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
						">
						<h1 className="text-2xl font-bold">
							🧙‍♀️Welcome to my home!✨
						</h1>
						<p className="text-lg">
							Potions & pastries await 🧙‍♀️☕
						</p>
						</div>
					</BannerImage.Banner>
				</BannerImage>

				<div className={"flex flex-col"}>
					<div className={"grid grid-cols-[1fr_auto]"}>
						{posts ? posts.map(Post => (
							<span key={Post.slug}>
					<div className={"mr-1"}>
						<span className={"text-xl"}>
							{Post.metadata.emoji ? Post.metadata.emoji : "🧙‍♀️"}
						</span>
					</div>
					<div className={"m-1"}>
						<PostExcerpt
							previewHeight="9rem"                      // ← lower if you want stricter cutoff
							minContentHeightToShowButton={180}        // ← increase to 220–280 if button still shows on 1-liners
							gradient={false}>
							<article className={"prose"}>
								<Post.Content/>
							</article>
						</PostExcerpt>
						<Separator/>
					</div>
					</span>
				)) : null}
				</div>
			</div>
			</div>
		</div>
	)
}