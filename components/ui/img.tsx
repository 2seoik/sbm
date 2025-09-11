/** biome-ignore-all lint/performance/noImgElement: img tag */
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: img tag */

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Img({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ComponentProps<"img">) {
  return (
    <img
      src={src}
      alt={alt}
      width={width || 30}
      height={height || 30}
      className={cn(className)}
      {...props}
    />
  );
}
