"use client";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  type ChangeEvent,
  type FormEvent,
  type ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from "react";
import Img from "./ui/img";

type Props = {
  src: string | Blob | undefined;
  alt?: string;
  changeImage?: (formData: FormData) => unknown;
  isNotProfile?: boolean;
  ref: ForwardedRef<ImageUploaderHandler>;
};

export type ImageUploaderHandler = {
  setSrc: (src: string | Blob | undefined) => void;
  getSrc: () => string | Blob | undefined;
};

export default function OgImageUploader({ src, alt, changeImage, ref }: Props) {
  const [img, setImg] = useState(src);

  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const handler: ImageUploaderHandler = {
    setSrc: (src: string | Blob | undefined) => setImg(src),
    getSrc: () => img,
    // setSrc: setImg,
  };
  useImperativeHandle(ref, () => handler);

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
    console.log(">>>> Image >>>>>>", formData.get("image"));
    uploadImage(formData);
  };

  const uploadImage = (formData: FormData) => {
    setErrorMsgs([]);

    startTransition(async () => {
      if (!changeImage) return;
      changeImage(formData);
    });
  };

  const dummyImage = `https://avatar.vercel.sh/${alt || ""}`;

  return (
    <form onSubmit={submitHandler} ref={formRef} className="w-full">
      <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-muted/30">
        <Img src={img} alt={alt || ""} onError={() => setImg(dummyImage)} className="h-full w-full object-cover" />
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
