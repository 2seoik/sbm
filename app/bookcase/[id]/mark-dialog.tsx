"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { PencilIcon, ZapIcon } from "lucide-react";
import { type MouseEvent, type PropsWithChildren, useActionState, useRef, useState } from "react";
import ImageUploader, { type ImageUploaderHandler } from "@/components/image-uploader";
import LabelInput from "@/components/label-input";
import OgImageUploader from "@/components/og-img-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { deleteMarkWithBookId, saveMark } from "./book.action";
import { scrapOg } from "./og.action";

export default function MarkDialog({
  mark = {
    id: 0,
    book: 0,
    link: "",
    image: "",
    title: "",
    descript: "",
    maker: 0,
  },
  bookId,
  children,
}: PropsWithChildren<{
  mark?: MarkData;
  bookId?: number;
}>) {
  const { confirm, alert, prompt } = useAlerter();
  // const [ispublic, setPublic] = useState(false);
  // const [withdel, setWithdel] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const imgUpRef = useRef<ImageUploaderHandler>(null);

  const [validError, save, isPending] = useActionState(async (_prev: ValidError | undefined, formData: FormData) => {
    const book = mark.id ? mark.book : bookId;

    formData.set("id", String(mark.id));
    formData.set("book", String(book));
    const img = imgUpRef.current?.getSrc();
    if (img) formData.set("image", img);

    console.log(">>>>>>", Object.fromEntries(formData.entries()));

    const err = await saveMark(formData);
    if (err) {
      return err;
    }

    setOpen(false);
    //
    // router.refresh();
  }, undefined);

  const remove = async () => {
    const ret = await confirm({
      title: "삭제 하시겠습니까?",
    });
    if (!ret) return;

    const code = await prompt({
      title: "삭제 코드 입력",
      desc: "삭제하려면 코드가 필요합니다.",
      placeholder: "코드를 입력하세요...",
    });
    if (!code) return;
    if (code !== "0000") {
      await alert({
        title: "코드가 일치하지 않습니다!",
        variant: "destructive",
      });
      return;
    }
    try {
      await deleteMarkWithBookId(mark.id, mark.book);
    } catch (error) {
      await alert(null, error);
    }

    //
    // router.refresh();

    setOpen(false);
  };
  const changeImage = (formData: FormData) => {};

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const scrap = async () => {
    console.log("scrap>>>", linkRef.current?.value);
    if (!linkRef.current?.value) {
      await alert({ title: "Input the Link!" });
      return;
    }

    if (!titleRef.current || !descRef.current || !imgUpRef.current) return;

    const { ogTitle, ogDescription, ogImage, favicon } = await scrapOg(linkRef.current.value);

    if (ogTitle) titleRef.current.value = ogTitle;
    if (ogDescription) descRef.current.value = ogDescription;
    if (ogImage?.length || favicon) {
      console.log(">>image url>>", ogImage?.[0]?.url);
      imgUpRef.current.setSrc(ogImage?.[0]?.url || favicon);
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const callSave = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger onClick={click} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl border border-accent/20 bg-accent/10 p-2">
              <PencilIcon className="h-5 w-5 text-accent" />
            </div>
            <DialogTitle className="font-display text-xl">Mark {!mark.id ? "추가" : "편집"}</DialogTitle>
          </div>
          <DialogDescription>설명...</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="space-y-2">
            <OgImageUploader
              src={mark.image || `https://avatar.vercel.sh/${mark.title}}`}
              alt={mark.title}
              changeImage={changeImage}
              ref={imgUpRef}
            />
          </div>
          <form action={save} ref={formRef}>
            <div className="space-y-5">
              <div className="space-y-2">
                <InputGroup>
                  <InputGroupInput
                    ref={linkRef}
                    id="link"
                    name={"link"}
                    defaultValue={mark.link}
                    placeholder="https://example.com/article"
                  />
                  <InputGroupAddon align="block-start">
                    <Label htmlFor="link" className="text-foreground">
                      URL
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          onClick={scrap}
                          type="button"
                          variant="secondary"
                          className="ml-auto rounded-full"
                        >
                          <ZapIcon />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>OG 정보 가져오기</p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
                <p className="text-muted-foreground text-xs">
                  버튼을 클릭하면 URL에서 제목과 설명을 자동으로 가져옵니다.
                </p>
              </div>
              <LabelInput
                label="제목"
                name="title"
                ref={titleRef}
                error={validError}
                defaultValue={mark.title}
                placeholder="제목을 입력하세요"
              />
              <div className="space-y-2">
                <Label htmlFor="descript" className="font-semibold text-sm capitalize">
                  설명
                </Label>
                <Textarea
                  placeholder="이 URL에 대한 메모를 남겨보세요."
                  id="descript"
                  name="descript"
                  ref={descRef}
                  defaultValue={mark.descript ?? ""}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>
          </form>

          <DialogFooter className="">
            <DialogClose asChild>
              <Button variant={"outline"}>취소</Button>
            </DialogClose>

            {!!mark.id && (
              <Button onClick={remove} type="button" variant={"destructive"}>
                삭제
              </Button>
            )}

            <Button onClick={callSave} type="submit" disabled={isPending}>
              Mark {mark.id ? "저장" : "추가"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
