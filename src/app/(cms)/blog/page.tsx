import { readdir } from "fs/promises";
import {PostExcerpt} from "@/witchy/PostExcerpt";
import {Post} from "@/witchy/cms/types"
import {sortPostsNewest} from "@/witchy/cms/sort";
import {Separator} from "@/components/ui/separator";

const category = "blog";
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
				<h1 className={"text-2xl underline"}>
					🧙‍♀️️️ My Blog! ✨
				</h1>

				<div className={"flex flex-col"}>
				<div className={"grid grid-cols-[1fr_auto]"}>
				{posts? posts.map(Post => (
					<>
					<div className={"mr-1"}>
						<span className={"text-xl"}>
							{Post.metadata.emoji ? Post.metadata.emoji : "📖"}
						</span>
					</div>
					<div className={"mb-1"}>
						<PostExcerpt
							previewHeight="5rem"                      // ← lower if you want stricter cutoff
							minContentHeightToShowButton={180}        // ← increase to 220–280 if button still shows on 1-liners
							gradient={false}>
							<article className={"prose"}>
								<Post.Content/>
							</article>
						</PostExcerpt>
						<Separator/>
					</div>
					</>
				)) : null}
				</div>
			</div>
			</div>
		</div>
	)
}