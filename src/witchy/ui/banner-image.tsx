import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface BannerImageProps extends React.HTMLAttributes<HTMLDivElement> {
	bannerPosition?: "top" | "bottom"
}

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {}

interface BannerImageImageProps
	extends Omit<NextImageProps, "alt" | "width" | "height"> {
	alt: string
	width?: number
	height?: number
	fill?: boolean
}

const BannerImage = React.forwardRef<HTMLDivElement, BannerImageProps>(
	({ bannerPosition = "top", className, children, ...props }, ref) => {
		const validChildren = React.Children.toArray(children).filter(
			(child): child is React.ReactElement =>
				React.isValidElement(child) &&
				(child.type === Banner || child.type === Image)
		)

		if (validChildren.length !== 2) {
			console.warn("BannerImage expects exactly two children: Banner and Image")
		}

		const bannerChild = validChildren.find((c) => c.type === Banner)
		const imageChild = validChildren.find((c) => c.type === Image)

		return (
			<div
				ref={ref}
				className={cn(
					"relative overflow-hidden rounded-lg border bg-muted/40",
					className
				)}
				{...props}
			>
				{imageChild}

				{bannerChild && (
					<div
						className={cn(
							"absolute inset-x-0 z-10",
							bannerPosition === "top" ? "top-0" : "bottom-0"
						)}
					>
						{bannerChild}
					</div>
				)}
			</div>
		)
	}
) as React.ForwardRefExoticComponent<BannerImageProps> & {
	Banner: React.ForwardRefExoticComponent<BannerProps>
	Image: React.ForwardRefExoticComponent<BannerImageImageProps>
}

BannerImage.displayName = "BannerImage"

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
	({ className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"bg-gradient-to-b from-black/70 via-black/50 to-transparent",
				"p-5 md:p-7 text-white text-center backdrop-blur-sm",
				"flex items-center justify-center min-h-[60px] md:min-h-[80px]",
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
)
Banner.displayName = "BannerImage.Banner"

const Image = React.forwardRef<HTMLDivElement, BannerImageImageProps>(
	(
		{
			alt,
			src,
			width,
			height,
			fill = true,
			className,
			priority,
			quality = 85,
			...rest
		},
		ref
	) => (
		<div
			ref={ref}
			className={cn("relative w-full h-full", fill && "aspect-[16/9] md:aspect-video")}
		>
			<NextImage
				src={src}
				alt={alt}
				fill={fill}
				width={!fill ? width : undefined}
				height={!fill ? height : undefined}
				quality={quality}
				priority={priority}
				className={cn(
					"object-cover object-center",
					className
				)}
				{...rest}
			/>
		</div>
	)
)
Image.displayName = "BannerImage.Image"

BannerImage.Banner = Banner
BannerImage.Image = Image

export { BannerImage }