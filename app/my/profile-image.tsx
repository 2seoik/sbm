"use client";

import Image, { type ImageProps } from "next/image";
import type { SyntheticEvent } from "react";

export default function ProfileImage(props: ImageProps) {
  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/profile_dummy.png";
  };

  return <Image onError={handleImgError} {...props} />;
}
