/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */

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
