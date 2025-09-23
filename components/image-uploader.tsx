"use client";
import Image, { type StaticImageData } from "next/image";
import { useSession } from "next-auth/react";
import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import type prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";

type Props = {
  src: string | StaticImageData;
  alt?: string;
  changeImage?: (
    formData: FormData
  ) => Promise<[ValidError, typeof prisma.member]>;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const { update } = useSession();

  const [isDragging, setIsDragging] = useState(false);
  const [img, setImg] = useState(src);

  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const setImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setPreview(e.target.files[0]);
  };

  const setPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setImg(e.target.result as string); // ArrayBuffer | null
      formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      if (!changeImage) return;
      const [err, mbr] = await changeImage(formData);
      if (err) return alert(err);
      await update(mbr);
    });
  };

  return (
    <form onSubmit={submitHandler} ref={formRef} className="w-full">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: 무슨오류인지 확인 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          if (!files?.length)
            console.log("🚀 ~ image-uploader.tsx ~ files[0]:", files[0]);
          setPreview(files[0]);
        }}
        className={cn(
          "relative aspect-square w-full cursor-pointer rounded-full border-2 shadow-md",
          { "border-blue-500 border-dotted": isDragging }
        )}
      >
        <Image
          src={img}
          alt={alt || ""}
          onClick={() => fileRef.current?.click()}
          className="rounded-full border"
          fill
          unoptimized={true}
        />
        <input
          type="file"
          name="image"
          ref={fileRef}
          accept="image/*"
          className="w-50"
          onChange={setImageFile}
          disabled={isPending}
          hidden
        />
      </div>
    </form>
  );
}
