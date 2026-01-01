"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { ZapIcon } from "lucide-react";
import {
  type MouseEvent,
  type PropsWithChildren,
  useActionState,
  useRef,
  useState,
} from "react";
import ImageUploader, {
  type ImageUploaderHandler,
} from "@/components/image-uploader";
import LabelInput from "@/components/label-input";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  children,
}: PropsWithChildren<{
  mark?: MarkData;
}>) {
  const { confirm, alert, prompt } = useAlerter();

  // const [ispublic, setPublic] = useState(false);
  // const [withdel, setWithdel] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const imgUpRef = useRef<ImageUploaderHandler>(null);

  const [validError, save, isPending] = useActionState(
    async (_prev: ValidError | undefined, formData: FormData) => {
      formData.set("id", String(mark.id));
      formData.set("book", String(mark.book));

      console.log(">>>>>>", Object.fromEntries(formData.entries()));
      const err = await saveMark(formData);
      if (err) {
        return err;
      }

      setOpen(false);
      //
      // router.refresh();
    },
    undefined
  );

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

    const { ogTitle, ogDescription, ogImage, favicon } = await scrapOg(
      linkRef.current.value
    );

    if (ogTitle) titleRef.current.value = ogTitle;
    if (ogDescription) descRef.current.value = ogDescription;
    if (ogImage?.length || favicon)
      imgUpRef.current.setSrc(ogImage?.[0]?.url || favicon);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mark.id ? "Edit" : "Create"} Mark</DialogTitle>
          <DialogDescription>{mark.link}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            <ImageUploader
              src={mark.image || `https://avatar.vercel.sh/${mark.title}`}
              alt={mark.title}
              changeImage={changeImage}
              ref={imgUpRef}
            />
          </div>

          <div className="col-span-2 border p-3">
            <form action={save} ref={formRef}>
              <div className="mt-5 space-y-5">
                <InputGroup>
                  <InputGroupInput
                    ref={linkRef}
                    name={"link"}
                    defaultValue={mark.link}
                    placeholder="Link(URL)..."
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={scrap}
                      type="button"
                      variant="secondary"
                      className=""
                    >
                      <ZapIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                <LabelInput
                  label="title"
                  name="title"
                  ref={titleRef}
                  error={validError}
                  defaultValue={mark.title}
                />

                <div className="flex flex-col">
                  <Label
                    htmlFor="descript"
                    className="font-semibold text-sm capitalize"
                  >
                    Description
                  </Label>
                  <Textarea
                    placeholder="description..."
                    id="descript"
                    name="descript"
                    ref={descRef}
                    defaultValue={mark.descript ?? ""}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {!!mark.id && (
            <Button onClick={remove} type="button" variant={"destructive"}>
              Delete
            </Button>
          )}

          <Button onClick={callSave} type="submit" disabled={isPending}>
            {mark.id ? "Save" : "Create"} Mark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
