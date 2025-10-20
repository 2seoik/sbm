import { MoreHorizontalIcon } from "lucide-react";
import AddMarkButton from "@/components/add-mark-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { default as UserMark } from "@/components/user-mark";
import type { Books } from "@/lib/db";

export default function Book({ books }: { books: Books }) {
  return books.map((book) => {
    const { id, title, Mark: marks } = book;
    return (
      <div
        key={id}
        className="flex w-96 flex-col justify-start rounded-lg border-2 border-red-300 bg-slate-200 px-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="my-2 font-medium text-lg">{title}</h1>
            <Badge
              variant={"outline"}
              className="ml-2 h-5 min-w-5 rounded-full bg-slate-50 px-1"
            >
              {marks.length}
            </Badge>
          </div>
          <Button
            variant={"ghost"}
            className="font-semibold text-lg hover:bg-slate-300"
          >
            <MoreHorizontalIcon />
          </Button>
        </div>
        <UserMark marks={marks} />
        <div className="my-1 flex justify-between font-medium">
          <AddMarkButton id={id} />

          <Button
            variant={"ghost"}
            className="font-semibold text-lg hover:bg-slate-300"
          >
            <MoreHorizontalIcon />
          </Button>
        </div>
      </div>
    );
  });
}
