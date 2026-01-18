// components/Blog.tsx
import { BlogToolbar } from './blog-toolbar';
import { BlogItems } from './blog-items';
import { BlogPagination } from './blog-pagination';
import type { Post, PostMeta } from './types'; // adjust to your types
import { BlogProvider } from './blog-context'; // ← add this if using context (recommended)

type BlogProps = {
	posts: Post[];
	postsPerPage?: number;
};

export function Blog({ posts, postsPerPage = 9 }: BlogProps) {
	const meta: PostMeta[] = posts.map(p => ({
		slug: p.slug,
		metadata: p.metadata,
	}));

	const sortedPosts = [...posts].sort((a, b) => {
		if (a.metadata.featured !== b.metadata.featured) {
			return a.metadata.featured ? -1 : 1;
		}
		return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
	});

	return (
		<BlogProvider initialMeta={meta}>
			<div className="container mx-auto py-8 px-4 max-w-5xl">
				<BlogToolbar />
				<div id="blog-loading" className="hidden text-center py-6 text-muted-foreground animate-pulse">
					Loading posts...
				</div>
				<BlogItems posts={sortedPosts} />
				<BlogPagination
					postsPerPage={postsPerPage}
					totalPosts={posts.length}
					initialMeta={meta}              // the lightweight array you already computed earlier
				/>
			</div>
		</BlogProvider>
	);
}