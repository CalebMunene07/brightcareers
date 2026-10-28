import NextImage, { type ImageProps } from "next/image";

// next/image for site photos. Uploaded images live on the R2 bucket URL set in Admin → Settings,
// which isn't known at build time, so absolute URLs are served as-is instead of being optimised.
export default function Image(props: ImageProps) {
  const external = typeof props.src === "string" && /^https?:\/\//.test(props.src);
  return <NextImage {...props} unoptimized={props.unoptimized ?? external} />;
}
