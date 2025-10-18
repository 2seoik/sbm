import { PlusIcon } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { findMemberByIdWithCount } from "@/lib/db";
import Book from "./book";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookCaseNickname({ params }: Props) {
  const { id } = use(params);
  const mbr = use(findMemberByIdWithCount(id));

  if (!mbr) return <h1 className="text-2xl">사용자가 없습니다.</h1>;

  return (
    <div className="my-2 flex max-h-full flex-col">
      <h1 className="flex items-center justify-between font-semibold text-2xl">
        <div className="flex items-center">
          {/* <UserAvatar id={id} withName={true} /> */}
          {mbr && <UserAvatar member={mbr} withName={true} />}
          <span className="ml-2 font-medium text-green-600">의 BookCase</span>
        </div>
        <span className="text-lg text-muted-foreground">
          Books {mbr._count.Book} : , Marks : {mbr._count.Mark}, Followers : 50
        </span>
      </h1>

      <div className="my-2 flex gap-2 overflow-x-scroll">
        <Book />
        <Button
          variant={"ghost"}
          className="flex w-96 justify-start bg-slate-200 font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Book
        </Button>
      </div>
    </div>
  );
}
