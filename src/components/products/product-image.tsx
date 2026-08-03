"use client";

import Image, { type ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

/** Local `/proizvodi/...` or remote Blob URLs. */
export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const remote = src.startsWith("http://") || src.startsWith("https://");
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={remote || props.unoptimized}
    />
  );
}
