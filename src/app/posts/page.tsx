// app/posts/page.tsx
import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'

// Define post type for TypeScript (optional but good)
interface Post {
	slug: string
	metadata: {
		title: string
		description: string
		date: string
		// Add more fields as needed
	}
}

// Get all posts at build time (runs on server/build)
async function getAllPosts(): Promise<Post[]> {
	const postsDir = path.join(process.cwd(), 'content/posts')
	const files = await fs.readdir(postsDir)

	const posts = await Promise.all(
		files
			.filter((file) => file.endsWith('.mdx'))  // Only MDX files
			.map(async (file) => {
				const slug = file.replace(/\.mdx$/, '')  // e.g., 'my-first-post'
				const mod = await import(`@/content/posts/${file}`)  // Dynamic import
				return { slug, metadata: mod.metadata }
			})
	)

	// Sort by date descending (newest first)
	posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

	return posts
}

export default async function PostsPage() {
	const posts = await getAllPosts()

	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-4xl font-bold mb-8">Blog Posts ✨</h1>

			{posts.length === 0 ? (
				<p>No spells cast yet... Add some MDX posts!</p>
			) : (
				<ul className="space-y-8">
					{posts.map((post) => (
						<li key={post.slug} className="border-b pb-6">
							<Link href={`/posts/${post.slug}`} className="text-2xl font-semibold hover:underline">
								{post.metadata.title}
							</Link>
							<p className="text-gray-600 mt-2">{post.metadata.description}</p>
							<p className="text-sm text-gray-500 mt-1">
								Published: {new Date(post.metadata.date).toLocaleDateString()}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

// For full static export (GitHub Pages)
export const revalidate = 0  // Or use ISR like 3600 if on Vercel