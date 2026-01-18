// components/Blog.tsx
import { BlogToolbar } from './blog-toolbar';
import { BlogItems } from './blog-items';
import { BlogPagination } from './blog-pagination';
import type { Post, PostMeta } from './types'; // adjust to your types

type BlogProps = {
	posts: Post[];
	postsPerPage?: number; // configurable, default 10
	featuredFirst?: boolean;
	sortDesc?: boolean;
};

export function Blog({
	                     posts,
	                     postsPerPage = 10,
	                     featuredFirst = true,
	                     sortDesc = true,
                     }: BlogProps) {
	// Lightweight metadata for client (serializable)
	const meta: PostMeta[] = posts.map((p) => ({
		slug: p.slug,
		metadata: p.metadata,
	}));

	// Optional initial sort on server (e.g., featured + newest)
	const sortedPosts = [...posts].sort((a, b) => {
		if (featuredFirst && a.metadata.featured !== b.metadata.featured) {
			return a.metadata.featured ? -1 : 1;
		}
		const da = new Date(a.metadata.date).getTime();
		const db = new Date(b.metadata.date).getTime();
		return sortDesc ? db - da : da - db;
	});

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			{/* Auto-add Toolbar (client) */}
			<BlogToolbar initialMeta={meta} />

			{/* Loading placeholder (client-managed) */}
			<div id="blog-loading" className="hidden text-center py-4 text-muted-foreground">
				Updating posts...
			</div>

			{/* All items rendered statically */}
			<BlogItems posts={sortedPosts} />

			{/* Auto-add Pagination (client) */}
			<BlogPagination
				totalPosts={posts.length}
				postsPerPage={postsPerPage}
				initialMeta={meta}
			/>
		</div>
	);
}