"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type MouseEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { createMark } from "@/app/bookcase/book.action";
import type { ValidError } from "@/lib/validator";
import LabelInput from "./label-input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AddMarkButton({ id: bookId }: { id: string | number }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [validError, setValidError] = useState<ValidError>();
  //   const [validError, formAction, isPending] = useActionState(
  //     async (_: ValidError | undefined, formData: FormData) => {
  //       const err = await createMark(formData);
  //       if (err) return err;
  //     },
  //     undefined
  //   );

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (bookId) formData.set("id", bookId.toString());

    startTransition(async () => {
      const err = await createMark(formData);
      if (err) {
        setValidError(err);
      } else {
        setValidError(undefined);
        closeBtnRef.current?.click();
        router.refresh();
      }
    });
  };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    formRef.current?.requestSubmit();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex justify-start font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Mark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Mark</DialogTitle>
          <DialogDescription>....</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={submitHandler}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <LabelInput label="Title" name="title" error={validError} />
              {/* <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" /> */}
            </div>
            <div className="grid gap-3">
              <LabelInput
                type="url"
                label="Link"
                name="link"
                placeholder="https://example.com"
                error={validError}
              />
              {/* <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" /> */}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="reset" ref={closeBtnRef} variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
