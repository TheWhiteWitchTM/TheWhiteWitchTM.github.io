// components/BlogToolbar.tsx
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateVisiblePosts } from './utils'; // we'll add this helper
import type { PostMeta } from './types';

type Props = { initialMeta: PostMeta[] };

export function BlogToolbar({ initialMeta }: Props) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState<'featured' | 'newest' | 'oldest'>('featured');
	const [isPending, startTransition] = useTransition();

	const handleUpdate = () => {
		startTransition(() => {
			// Show loading
			const loadingEl = document.getElementById('blog-loading');
			if (loadingEl) loadingEl.classList.remove('hidden');

			// Filter + sort + update DOM
			updateVisiblePosts({ meta: initialMeta, search, sort, page: 1, postsPerPage: 10 }); // adjust postsPerPage

			// Hide loading after short delay (or use effect)
			setTimeout(() => loadingEl?.classList.add('hidden'), 300);
		});
	};

	// Trigger on change
	useEffect(handleUpdate, [search, sort, initialMeta]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-6">
			<Input
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-md"
			/>
			<Select value={sort} onValueChange={(v) => setSort(v as any)}>
				<SelectTrigger className="w-48">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="featured">Featured first</SelectItem>
					<SelectItem value="newest">Newest first</SelectItem>
					<SelectItem value="oldest">Oldest first</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}