import {
  AlbumIcon,
  BookKeyIcon,
  CopyXIcon,
  HeartPlusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { use } from "react";
import IconLabel from "@/components/icon-label";
import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { type BookAllColumn, findBookWithMarkById } from "@/lib/db";
import { cn } from "@/lib/utils";
import BookDialog from "./book-dialog";
import Mark from "./mark";

type Props =
  | {
      id: number;
      book?: undefined;
    }
  | { id?: undefined; book: NonNullable<BookAllColumn> };

export default function Book({ id, book }: Props) {
  const data = book ? book : use(findBookWithMarkById(id));
  if (!data)
    return (
      <h1 className="font-semibold text-lg text-muted-foreground">
        Book 을 찾을수 없습니다.
      </h1>
    );

  const { id: bookId, title, remark, ispublic, withdel, member } = data;
  const session = use(auth());
  // 숫자를 감싸는것보다, 문자를감싸는게 유리!
  const isMine = session?.user.id === String(member);

  return (
    <div className="flex w-80 flex-shrink-0 flex-col justify-start rounded-lg bg-slate-200 pl-2">
      <div className="flex items-center justify-between pr-2">
        <h1
          className={cn(
            "flex items-center truncate p-2 font-semibold text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300"
          )}
        >
          {!ispublic && <BookKeyIcon />}
          {title}
        </h1>

        {isMine ? (
          <BookDialog book={book}>
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <MoreHorizontalIcon />
            </Button>
          </BookDialog>
        ) : (
          ispublic && (
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <IconLabel
                icon={<UserRoundPlusIcon className="text-green-500" />}
                noti={"success"}
              >
                <small>50</small>
              </IconLabel>
            </Button>
          )
        )}
      </div>
      {/* mark group */}
      <div className="max-h-full space-y-2 overflow-y-scroll pr-2 pb-3">
        <Mark />
        <Mark />
      </div>
      {isMine && (
        <div className="my-1 flex items-center justify-between pr-2 font-medium">
          <Button
            variant={"ghost"}
            className="flex w-[60%] justify-start font-semibold text-lg hover:bg-slate-300"
          >
            <PlusIcon /> Add a Mark
          </Button>
          <div className="flex">
            <IconLabel icon={<AlbumIcon />}>99</IconLabel>
            {ispublic && <IconLabel icon={<HeartPlusIcon />}>99</IconLabel>}

            {withdel && (
              <ToolTip content={"With Del"}>
                <CopyXIcon className="text-red-500" />
              </ToolTip>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
