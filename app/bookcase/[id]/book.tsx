import {
  AlbumIcon,
  BookKeyIcon,
  CopyXIcon,
  HeartPlusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { use } from "react";
import IconLabel from "@/components/icon-label";
import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { type BookAllColumn, findBookWithMarkById } from "@/lib/db";
import { cn } from "@/lib/utils";
import BookDialog from "./book-dialog";
import FollowButton from "./follow-button";
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

  const {
    id: bookId,
    title,
    remark,
    ispublic,
    withdel,
    member,
    Mark: marks,
    FollowBook: followBooks,
  } = data;
  const session = use(auth());
  // 숫자를 감싸는것보다, 문자를감싸는게 유리!
  const isMine = session?.user.id === String(member);
  const loginUserId = Number(session?.user.id);
  // server 컴포넌트이기 때문에 가능
  // const totalLikesCnt = book?.Mark.reduce(
  //   (acc, mark) => acc + mark.Likes.length,
  //   0
  // );

  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-slate-200 pl-2 dark:bg-muted">
      <div className="flex items-center justify-between pr-2">
        <h1
          className={cn(
            "flex items-center truncate p-2 font-semibold text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300"
          )}
          title={remark || title}
        >
          {process.env.NODE_ENV === "development" && (
            <small className="text-muted-foreground">{bookId}</small>
          )}
          {!ispublic && <BookKeyIcon className="inline" />} {title}
        </h1>

        {/* // Book 수정 */}
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
            // Book 팔로우 버튼
            <FollowButton
              bookId={bookId}
              bookOwner={member}
              isActive={followBooks
                .map(({ member }) => member)
                .includes(loginUserId)}
            >
              {followBooks.length}
            </FollowButton>
          )
        )}
      </div>

      {/* mark group */}
      <div className="max-h-full space-y-2 overflow-y-scroll pr-2 pb-3">
        {marks.length ? (
          marks.map((mark) => (
            <Mark
              key={mark.id}
              mark={mark}
              withdel={withdel}
              bookOwner={member}
              followBooks={book?.FollowBook.length}
            />
          ))
        ) : (
          <h1 className="rounded-lg bg-white p-5 font-medium text-muted-foreground text-sm">
            Mark가 없습니다.
          </h1>
        )}
      </div>
      {isMine && (
        <div className="my-1 flex items-center justify-between pr-2 font-medium">
          <Button
            variant={"ghost"}
            className="flex rounded-full font-semibold text-lg hover:bg-muted-foreground/30 dark:hover:bg-muted-foreground/30"
          >
            <PlusIcon /> Mark 만들기
          </Button>
          <div className="flex gap-2">
            {/* Mark 갯수 */}
            <IconLabel icon={<AlbumIcon />}>{marks.length}</IconLabel>

            <IconLabel noti={"success"} icon={<ThumbsUpIcon className="" />}>
              {marks.reduce((acc, mark) => acc + mark.Likes.length, 0)}
            </IconLabel>
            {/* 북 팔로우 갯수 */}
            {ispublic && (
              <IconLabel
                noti={"destructive"}
                icon={<HeartPlusIcon className="text-red-400" />}
              >
                {followBooks.length}
                {/* 한눈에 값을 확인할수 있기 때문에 아래와 같이 하는 경우도 있음 */}
                {/* {book?.Mark.reduce((acc, mark) => acc + mark._count.Likes, 0)} */}
              </IconLabel>
            )}

            {withdel && (
              <ToolTip
                content={"해당 Book의 Mark는 열람과 함께 삭제됩니다!"}
                variant="destructive"
              >
                <CopyXIcon className="text-red-500" />
              </ToolTip>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
