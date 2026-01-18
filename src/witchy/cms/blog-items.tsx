// components/BlogItems.tsx
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Post } from './types';

type Props = { posts: Post[] };

export function BlogItems({ posts }: Props) {
	return (
		<div className="space-y-6" id="blog-items">
			{posts.map((post) => (
				<Card
					key={post.slug}
					data-post-slug={post.slug}
					className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="grid grid-cols-[auto_1fr] min-h-[140px]">
						{/* Left: emoji + star */}
						<div className="bg-muted/30 px-4 py-5 flex flex-col items-center border-r">
							{post.metadata.featured && (
								<Star className="h-6 w-6 fill-yellow-400 text-yellow-500 mb-3" />
							)}
							<span className="text-4xl sm:text-5xl">{post.metadata.emoji || '📝'}</span>
						</div>

						{/* Right: title + Content + read more + date */}
						<div className="p-5 flex flex-col">
							<h3 className="text-xl font-semibold mb-3">{post.metadata.title}</h3>
							<div className="prose prose-neutral prose-sm max-w-none flex-grow">
								<div className={(post.metadata.description?.length ?? 0) > 350 ? 'max-h-[220px] overflow-hidden relative' : ''}>
									<post.Content />
									{ (post.metadata.description?.length ?? 0) > 350 && (
										<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
									)}
								</div>
							</div>
							{ (post.metadata.description?.length ?? 0) > 350 && (
								<div className="mt-4">
									<Button variant="outline" size="sm" asChild>
										<Link href={`/blog/${post.slug}`}>Read full post →</Link>
									</Button>
								</div>
							)}
							<div className="mt-4 text-sm text-muted-foreground">
								{format(new Date(post.metadata.date), 'MMMM d, yyyy')}
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}