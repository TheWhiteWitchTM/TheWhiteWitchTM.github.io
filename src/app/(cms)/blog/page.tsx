import type { ComponentType } from "react";
import { readdir } from "fs/promises";
import {Metadata} from "next";
import ExpandablePostContent from "@/witchy/ExpandablePostContent";
import {PostExcerpt} from "@/witchy/PostExcerpt";

export interface Post {
	Content: React.ComponentType
	slug: string;
	metadata: Metadata;
}

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
	const posts = await getPosts(path)
	return (
		<div className={"w-full justify-center justify-items-center"}>
			<div className={"min-w-1/2 max-w-1/3 flex flex-col gap-3 m-3 p-3"}>
			<h1>My Blog!</h1>
			<div className={"flex flex-col"}>
				{posts? posts.map(Post => (
					<PostExcerpt
						previewHeight="5rem"                      // ← lower if you want stricter cutoff
						minContentHeightToShowButton={180}        // ← increase to 220–280 if button still shows on 1-liners
						gradient={true}>
						<article className={"prose"}>
							<Post.Content/>
						</article>
						</PostExcerpt>
				)) : null }
			</div>
		</div>
		</div>
	)
}