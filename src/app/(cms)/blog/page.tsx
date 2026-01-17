import type { ComponentType } from "react";
import { readdir } from "fs/promises";

export interface Post {
	default: ComponentType  // the MDX content as <Component />
	metadata?: {
		title: string
		date: string
		description?: string
		author?: string
		tags?: string[]
		image?: string
		[key: string]: unknown
	}
}

const category = "blog";
const path = "/src/app/(cms)/"+category+"/(posts)/"

async function getPosts(path: string) {
	const slugs = (
		await readdir(process.cwd()+path, { withFileTypes: true })
	).filter((dirent) => dirent.isDirectory());

	return await Promise.all(
		slugs.map(async ({ name }) => {
			const post:Post = await import("./(posts)/"+name+"/page.mdx");
			return post;
		})
	);
}

export default async function () {
	const posts = await getPosts(path)
	return (
		<div className={"flex flex-col"}>
			<code>
				{path}
			</code>
			<code>
				{posts? posts.map(post => (
					<div>
						{post.metadata?.title}
					</div>
				)) : null }
			</code>
		</div>
	)
}