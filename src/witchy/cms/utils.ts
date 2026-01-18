// components/utils.ts
import {PostMeta} from "@/witchy/cms/types";

export function updateVisiblePosts({
	                                   meta,
	                                   search = '',
	                                   sort = 'featured',
	                                   page = 1,
	                                   postsPerPage = 10,
                                   }: {
	meta: PostMeta[];
	search?: string;
	sort?: 'featured' | 'newest' | 'oldest';
	page?: number;
	postsPerPage?: number;
}) {
	let filtered = [...meta];

	if (search.trim()) {
		const term = search.toLowerCase();
		filtered = filtered.filter((p) =>
			p.metadata.title.toLowerCase().includes(term) ||
			(p.metadata.description ?? '').toLowerCase().includes(term) ||
			(p.metadata.tags ?? []).some((t) => t.toLowerCase().includes(term))
		);
	}

	filtered.sort((a, b) => {
		if (sort === 'featured' && a.metadata.featured !== b.metadata.featured) {
			return a.metadata.featured ? -1 : 1;
		}
		const da = new Date(a.metadata.date).getTime();
		const db = new Date(b.metadata.date).getTime();
		return sort === 'oldest' ? da - db : db - da;
	});

	// Paginate
	const start = (page - 1) * postsPerPage;
	const end = start + postsPerPage;
	const visible = filtered.slice(start, end).map((p) => p.slug);

	// DOM manipulation
	document.querySelectorAll('[data-post-slug]').forEach((el) => {
		(el as HTMLElement).style.display = 'none';
		(el as HTMLElement).style.order = '9999';
	});

	visible.forEach((slug, idx) => {
		const el = document.querySelector(`[data-post-slug="${slug}"]`);
		if (el) {
			(el as HTMLElement).style.display = 'block';
			(el as HTMLElement).style.order = String(idx);
		}
	});
}