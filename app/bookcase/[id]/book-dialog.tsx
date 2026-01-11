"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { BookMarkedIcon, BookOpenIcon, FlameIcon, GlobeIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, RefObject, useActionState, useEffect, useRef, useState } from "react";
import CheckSwitch from "@/components/check-switch";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { BookData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { deleteBook, saveBook } from "./book.action";

type OptionKey = "isPublic" | "burnAfterReading";

export default function BookDialog({
  book = {
    id: 0,
    title: "",
    ispublic: false,
    withdel: false,
    remark: "",
    member: 0,
  },
  children,
}: PropsWithChildren<{
  book?: BookData;
}>) {
  const router = useRouter();
  const { confirm, alert, prompt } = useAlerter();

  // const [ispublic, setPublic] = useState(false);
  // const [withdel, setWithdel] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    isPublic: false,
    burnAfterReading: false,
  });

  const [validError, save, isPending] = useActionState(async (_prev: ValidError | undefined, formData: FormData) => {
    // formData.set("ispublic", ispublic ? "on" : "");
    // formData.set("withdel", withdel ? "on" : "");

    // id 가 있는경우 수정처리
    formData.set("id", String(book.id));
    // console.log(">>>>>>", Object.fromEntries(formData.entries()));
    const err = await saveBook(formData);
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
    const err = await deleteBook(book.id);
    if (err) {
      await alert({ title: err.id.errors[0], okText: "Confirm" });
      setOpen(false);
      return;
    }

    //
    // router.refresh();

    setOpen(false);
  };

  //   const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.currentTarget);

  //     startTransition(() => {
  //       save(formData);
  //     });
  //   };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   if (book) {
  //     setPublic(book.ispublic || !!validError?.ispublic?.value);
  //     setWithdel(!!validError?.withdel?.value);
  //   }
  // }, [validError]);

  const handleOptionChange = (key: OptionKey, value: boolean) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
              <BookMarkedIcon className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">Book {!book.id ? "만들기" : "수정하기"}</DialogTitle>
          </div>
          <DialogDescription>설명...</DialogDescription>
        </DialogHeader>
        <form action={save} className="mt-4 space-y-5">
          <div className="space-y-2">
            <LabelInput
              label="제목"
              name="title"
              error={validError}
              defaultValue={book.title}
              placeholder="예: React 심화 학습"
              defaultChecked
            />
            {/* <div className="flex items-center gap-3">
              <Checkbox
                id="ispublic"
                name="ispublic"
                checked={ispublic}
                onCheckedChange={(checked) => setPublic(!!checked)}
              />
              <Label htmlFor="ispublic" className="cursor-pointer">
                Public {ispublic && "XX"}
              </Label>
            </div> */}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              {options.isPublic ? (
                <GlobeIcon className="h-5 w-5 text-primary" />
              ) : (
                <LockIcon className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-sm">{options.isPublic ? "공개" : "비공개"}</p>
                <p className="text-muted-foreground text-xs">
                  {options.isPublic ? "모든 사람이 이 Book을 볼 수 있습니다." : "나만 이 Book을 볼 수 있습니다."}
                </p>
              </div>
            </div>
            <CheckSwitch
              type="switch"
              name="ispublic"
              label="공개 설정"
              error={validError}
              checkValue={book.ispublic}
              setCheckedFunction={(checked) => handleOptionChange("isPublic", checked)}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              {options.burnAfterReading ? (
                <FlameIcon className="h-5 w-5 text-orange-500" />
              ) : (
                <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-sm">{options.burnAfterReading ? "1회성 열람" : "영구 보관"}</p>
                <p className="text-muted-foreground text-xs">
                  {options.burnAfterReading
                    ? "열람 후 자동으로 Mark가 삭제됩니다."
                    : "Mark가 삭제되지 않고 Book에 계속 보관됩니다."}
                </p>
              </div>
            </div>
            <CheckSwitch
              name="withdel"
              label="보관 설정"
              type="switch"
              error={validError}
              checkValue={book.withdel}
              setCheckedFunction={(checked) => handleOptionChange("burnAfterReading", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">설명</Label>
            <Textarea
              placeholder="Book 설명..."
              id="remark"
              name="remark"
              defaultValue={book.remark ?? ""}
              className="resize-none"
              rows={3}
            />
            {/* <div>
              <div className="flex items-center gap-3">
                <Switch
                  id="withdel"
                  name="withdel"
                  checked={withdel}
                  onCheckedChange={(checked) => setWithdel(!!checked)}
                />
                <Label htmlFor="withdel" className="cursor-pointer">
                  Open with deletion
                </Label>
              </div>
              <p className="mt-1 text-red-500 text-sm">
                {validError?.withdel?.errors[0]}
              </p>
            </div> */}
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant={"outline"}>취소</Button>
            </DialogClose>

            {!!book.id && (
              <Button onClick={remove} type="button" variant={"destructive"}>
                삭제
              </Button>
            )}

            <Button type="submit" disabled={isPending}>
              Book {book.id ? "저장" : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
