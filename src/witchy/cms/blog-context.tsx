// components/BlogContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { PostMeta } from './types'  // ← adjust this import to match your types file

type BlogState = {
	search: string
	setSearch: (s: string) => void
	sort: 'featured' | 'newest' | 'oldest'
	setSort: (s: 'featured' | 'newest' | 'oldest') => void
	page: number
	setPage: (p: number) => void
	meta: PostMeta[]
}

const BlogContext = createContext<BlogState | undefined>(undefined)

export function BlogProvider({
	                             children,
	                             initialMeta,
                             }: {
	children: ReactNode
	initialMeta: PostMeta[]
}) {
	const [search, setSearch] = useState('')
	const [sort, setSort] = useState<'featured' | 'newest' | 'oldest'>('featured')
	const [page, setPage] = useState(1)

	return (
		<BlogContext.Provider
			value={{
				search,
				setSearch,
				sort,
				setSort,
				page,
				setPage,
				meta: initialMeta,
			}}
		>
			{children}
		</BlogContext.Provider>
	)
}

export function useBlog() {
	const context = useContext(BlogContext)
	if (context === undefined) {
		throw new Error('useBlog must be used within a BlogProvider')
	}
	return context
}