import withMDX from '@next/mdx';
import withSerwistInit from '@serwist/next';

const revision = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev'; // or use git rev-parse if you want

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',          // we'll create this next
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: [{ url: '/', revision }], // precache home
  // reloadOnOnline: false,    // optional
  // cacheOnNavigation: true,  // optional
});

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

export default withSerwist(withMDX(mdxConfig)(nextConfig));