import withMDX from '@next/mdx';

const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

const mdxConfig = {
	extension: /\.mdx?$/,
	options: {
		//remarkPlugins: [remarkGfm],
		//rehypePlugins: [ rehypePrettyCode, rehypeSlug, rehypeAutolinkHeadings ], // add if needed
	},
};

export default withMDX(mdxConfig)(nextConfig);