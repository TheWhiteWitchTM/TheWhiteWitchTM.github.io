import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		// Example: nicer headings, custom code blocks, etc.
		h1: ({ children }) => <h1 style={{ color: 'navy' }}>{children}</h1>,
		// code: ... → use rehype-pretty-code instead for highlighting

		...components, // keep defaults
	};
}