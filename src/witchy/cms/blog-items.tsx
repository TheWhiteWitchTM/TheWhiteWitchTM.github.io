// src/witchy/cms/blog-items.tsx
import { Star } from 'lucide-react'
import { format } from 'date-fns'
import type { Post } from './types' // adjust path to your types
import ExpandButton from './ExpandButton' // ← the tiny client component below

export function BlogItems({ posts }: { posts: Post[] }) {
	return (
		<div id="blog-items" className="flex flex-col gap-6">
			{posts.map((post) => (
				<article
					key={post.slug}
					data-post-slug={post.slug}
					className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card"
					style={{ display: 'block', order: '9999' }}
				>
					<div className="grid grid-cols-[auto_1fr] min-h-[140px]">
						{/* Left column – emoji/star + expand button at bottom */}
						<div className="bg-muted/30 px-4 py-6 flex flex-col items-center border-r w-[80px] sm:w-[100px]">
							{post.metadata.featured && (
								<Star className="h-7 w-7 fill-yellow-400 text-yellow-500 mb-4" />
							)}
							<span className="text-5xl sm:text-6xl mb-auto">
                {post.metadata.emoji || '📜'}
              </span>

							{/* Client-side expand button (appears only when needed) */}
							<ExpandButton slug={post.slug} />
						</div>

						{/* Right column – full MDX content with height cap */}
						<div className="p-5 flex flex-col">
							<div className="prose prose-neutral prose-sm max-w-none flex-grow">
								<div
									className="relative max-h-[200px] overflow-hidden transition-all duration-300"
									id={`content-wrapper-${post.slug}`}
									data-content-wrapper
								>
									<post.Content />
									<div
										className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"
										id={`fade-${post.slug}`}
										data-fade
									/>
								</div>
							</div>

							<div className="mt-4 text-sm text-muted-foreground">
								{format(new Date(post.metadata.date), 'MMMM d, yyyy')}
							</div>
						</div>
					</div>
				</article>
			))}
		</div>
	)
}