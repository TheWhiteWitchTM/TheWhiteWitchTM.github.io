import { readdir } from "fs/promises";
import {Post} from "@/witchy/cms/types"

const category = "rage";
const path = "/src/app/(cms)/"+category+"/(posts)/"

export async function getAllPosts() {
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