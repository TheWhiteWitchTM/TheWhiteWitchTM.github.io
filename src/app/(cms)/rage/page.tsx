import {BannerImage} from "@/witchy/ui/banner-image";
import {getAllPosts} from "./get-all-posts"
import {Blog} from "@/witchy/cms/blog";
import BlogClientLogic from "@/witchy/cms/blog-client-logic";

export default async function () {
	const posts = await getAllPosts();
	return (
		<div className={"w-full justify-center justify-items-center"}>
			<div className={"min-w-1/2 max-w-5/6 flex flex-col gap-3 m-3 p-3"}>
				<BannerImage>
					<BannerImage.Image
						src="/banner/rants.jpg"
						alt="Cozy witch brewing coffee"
					/>
					<BannerImage.Banner className="rounded-full">
						<div className="
						-py-14 opacity-90 inline-blockrounded-2xl
						bg-black/70  border border-white/10
						shadow-2xl shadow-black/50
						text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
						">
						<h1 className="text-md font-bold">
							🤬This is mental, this is insane!💩
						</h1>
						<p className="text-sm">
							May the flying spaghetti monster have mercy on our souls!🍝
						</p>
						</div>
					</BannerImage.Banner>
				</BannerImage>

				<Blog posts={posts} />
				<BlogClientLogic/>
			</div>
		</div>
	)
}