// components/BlogToolbar.tsx
'use client';

import { useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlog } from './blog-context';
import { updateVisiblePosts } from './utils';

// components/BlogToolbar.tsx

export function BlogToolbar() {
	const { search, setSearch, sort, setSort, page, setPage, meta } = useBlog();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		startTransition(() => {
			const loading = document.getElementById('blog-loading');
			if (loading) loading.classList.remove('hidden');

			updateVisiblePosts({ meta, search, sort, page, postsPerPage: 9 });

			setTimeout(() => loading?.classList.add('hidden'), 400);
		});
	}, [search, sort, page, meta]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-8">
			<Input
				placeholder="Search posts..."
				value={search}
				onChange={e => {
					setSearch(e.target.value);
					setPage(1); // reset to page 1 on search
				}}
				className="max-w-md"
			/>
			<Select value={sort} onValueChange={v => {
				setSort(v as any);
				setPage(1);
			}}>
				<SelectTrigger className="w-56">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="featured">Featured + Newest</SelectItem>
					<SelectItem value="newest">Newest first</SelectItem>
					<SelectItem value="oldest">Oldest first</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}