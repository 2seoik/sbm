"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
  type PropsWithChildren,
  useActionState,
  useEffect,
  useState,
} from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { BookData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { deleteBook, saveBook } from "./book.action";

export default function BookDialog({
  book = {
    id: 0,
    title: "",
    ispublic: true,
    withdel: false,
    remark: "",
    member: 0,
  },
  children,
}: PropsWithChildren<{
  book?: BookData;
}>) {
  const router = useRouter();
  const [ispublic, setPublic] = useState(false);
  const [withdel, setWithdel] = useState(false);

  const [validError, save, isPending] = useActionState(
    async (_prev: ValidError | undefined, formData: FormData) => {
      formData.set("ispublic", ispublic ? "on" : "");
      formData.set("withdel", withdel ? "on" : "");
      const err = await saveBook(formData);
      if (err) {
        return err;
      }
      router.refresh();
    },
    undefined
  );

  const remove = async () => {
    await deleteBook(book.id);
    router.refresh();
  };

  //   const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.currentTarget);

  //     startTransition(() => {
  //       save(formData);
  //     });
  //   };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (book) {
      setPublic(!!validError?.ispublic?.value);
      setWithdel(!!validError?.withdel?.value);
    }
  }, [validError]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form action={save}>
          <DialogHeader>
            <DialogTitle>{!book.id ? "Create" : "Edit"} Book</DialogTitle>
            <DialogDescription>descript...</DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            <LabelInput
              label="title"
              name="title"
              error={validError}
              //   defaultValue={book.title}
              defaultChecked
            />

            <div className="flex items-center gap-3">
              <Checkbox
                id="ispublic"
                name="ispublic"
                checked={ispublic}
                onCheckedChange={(checked) => setPublic(!!checked)}
              />
              <Label htmlFor="ispublic" className="cursor-pointer">
                Public {ispublic && "XX"}
              </Label>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Checkbox
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
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="remark"
                className="font-semibold text-sm capitalize"
              >
                Description
              </Label>
              <Textarea
                placeholder="description..."
                id="remark"
                name="remark"
                defaultValue={book.remark ?? ""}
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>

            {!!book.id && (
              <Button onClick={remove} type="button" variant={"destructive"}>
                Delete
              </Button>
            )}

            <Button type="submit" disabled={isPending}>
              {book.id ? "Save" : "Create"} Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
