"use client";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import ProfileImage from "@/app/my/profile-image";
import type { UpdateProfileImageReturn } from "@/app/sign/sign.action";
import { cn } from "@/lib/utils";

type Props = {
  src: string | StaticImageData;
  alt?: string;
  changeImage?: (formData: FormData) => UpdateProfileImageReturn;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const router = useRouter();
  const { update } = useSession();

  const [isDragging, setIsDragging] = useState(false);
  const [img, setImg] = useState(src);

  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const setImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setPreview(e.target.files[0], true);
  };

  const setPreview = (file: File, needSubmit = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setImg(e.target.result as string); // ArrayBuffer | null
      if (needSubmit) formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(">>>>>>>>>>>>", formData.get("image"));
    uploadImage(formData);
  };

  const uploadImage = (formData: FormData) => {
    setErrorMsgs([]);

    startTransition(async () => {
      if (!changeImage) return;
      const [err, mbr] = await changeImage(formData);
      if (err) {
        console.log("ERR>>", err);
        setImg(src);
        if (typeof err.image === "object" && err.image?.errors) {
          setErrorMsgs(err.image.errors);
        }
        return;
      }
      await update(mbr);
      router.refresh();
    });
  };

  // useEffect(() => {
  //   console.log("src", src);
  // });
  return (
    <form onSubmit={submitHandler} ref={formRef} className="w-full">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: file attach */}
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
          if (files?.length) setPreview(files[0]);

          const formData = new FormData();
          formData.append("image", files[0]);
          uploadImage(formData);
        }}
        className={cn(
          "relative aspect-square w-full cursor-pointer rounded-full border-2 shadow-md",
          { "border-blue-500 border-dotted": isDragging }
        )}
      >
        <ProfileImage
          src={img}
          alt={alt || ""}
          onClick={() => fileRef.current?.click()}
          className="rounded-full border"
          // onError={() => setImg("/profile_dummy.png")}
          fill
          unoptimized={process.env.NODE_ENV === "development"}
        />
        <input
          type="file"
          name="image"
          ref={fileRef}
          accept="image/*"
          onChange={setImageFile}
          disabled={isPending}
          hidden
        />
      </div>
      <div className="">
        {errorMsgs.map((emsg) => (
          <p key={emsg} className="text-red-500">
            {emsg}
          </p>
        ))}
      </div>
    </form>
  );
}
