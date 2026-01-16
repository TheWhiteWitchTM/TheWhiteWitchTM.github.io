import fs from 'fs/promises'
import path from 'path'
export async function generateStaticParams() {
	const postsDir = path.join(process.cwd(), 'content/posts')
	const files = await fs.readdir(postsDir)
	return files
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => ({ slug: file.replace(/\.mdx$/, '') }))
}