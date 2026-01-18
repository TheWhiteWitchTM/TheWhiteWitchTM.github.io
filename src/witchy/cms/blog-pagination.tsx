// components/BlogPagination.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateVisiblePosts } from './utils';
import type { PostMeta } from './types';

type Props = {
	totalPosts: number;
	postsPerPage: number;
	initialMeta: PostMeta[]; // optional if shared from parent, but for simplicity pass here too
	currentSearch?: string; // if you want to sync with toolbar state – or use context
	currentSort?: 'featured' | 'newest' | 'oldest';
};

export function BlogPagination({
	                               totalPosts,
	                               postsPerPage,
	                               initialMeta,
	                               currentSearch = '',
	                               currentSort = 'featured',
                               }: Props) {
	const [page, setPage] = useState(1);
	const [isPending, startTransition] = useTransition();

	const totalPages = Math.ceil(totalPosts / postsPerPage);

	const handlePageChange = (newPage: number) => {
		startTransition(() => {
			setPage(newPage);
			updateVisiblePosts({
				meta: initialMeta,
				search: currentSearch,
				sort: currentSort,
				page: newPage,
				postsPerPage,
			});
		});
	};

	return (
		<div className="flex justify-center gap-2 mt-8">
			<Button
				variant="outline"
				disabled={page === 1 || isPending}
				onClick={() => handlePageChange(page - 1)}
			>
				Prev
			</Button>
			{Array.from({ length: totalPages }, (_, i) => (
				<Button
					key={i}
					variant={page === i + 1 ? 'default' : 'outline'}
					onClick={() => handlePageChange(i + 1)}
					disabled={isPending}
				>
					{i + 1}
				</Button>
			))}
			<Button
				variant="outline"
				disabled={page === totalPages || isPending}
				onClick={() => handlePageChange(page + 1)}
			>
				Next
			</Button>
		</div>
	);
}