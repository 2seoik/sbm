import {
  AlbumIcon,
  BookKeyIcon,
  BookmarkIcon,
  CopyXIcon,
  GlobeIcon,
  HeartPlusIcon,
  LockIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { use } from "react";
import IconLabel from "@/components/icon-label";
import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { auth } from "@/lib/auth";
import { type BookAllColumn, findBookWithMarkById } from "@/lib/db";
import { cn } from "@/lib/utils";
import BookDialog from "./book-dialog";
import FollowButton from "./follow-button";
import Mark from "./mark";

type Props =
  | {
      id: number;
      index: number;
      book?: undefined;
    }
  | { id?: undefined; index: number; book: NonNullable<BookAllColumn> };

export default function Book({ id, index, book }: Props) {
  const data = book ? book : use(findBookWithMarkById(id));
  if (!data) return <h1 className="font-semibold text-lg text-muted-foreground">Book 을 찾을수 없습니다.</h1>;

  const { id: bookId, title, remark, ispublic, withdel, member, Mark: marks, FollowBook: followBooks } = data;
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
    <div
      className="flex w-[300px] flex-shrink-0 animate-fade-in flex-col opacity-0 sm:w-[340px] lg:w-[360px]"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
    >
      {/* Book Header with Gradient Accent */}
      <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-br p-[1px]`}>
        <div className="rounded-t-2xl bg-card p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              {ispublic ? (
                <div className="rounded-md bg-primary/10 p-1.5">
                  <GlobeIcon className="h-3.5 w-3.5 text-primary" />
                </div>
              ) : (
                <div className="rounded-md bg-muted p-1.5">
                  <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <h3 className="truncate font-display font-semibold text-foreground">{title}</h3>
            </div>
            {isMine ? (
              <BookDialog book={book}>
                <Button variant={"ghost"} className="font-semibold text-lg hover:bg-slate-300">
                  <MoreHorizontalIcon />
                </Button>
              </BookDialog>
            ) : (
              ispublic && (
                // Book 팔로우 버튼
                <FollowButton
                  bookId={bookId}
                  bookOwner={member}
                  isActive={followBooks.map(({ member }) => member).includes(loginUserId)}
                >
                  {followBooks.length}
                </FollowButton>
              )
            )}
          </div>

          {/* Mini stats */}
          <div className="mt-2 flex items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <IconLabel icon={<AlbumIcon />}>{marks.length}</IconLabel>
            </span>
            <span className="flex items-center gap-1">
              <IconLabel noti={"success"} icon={<ThumbsUpIcon className="" />}>
                {marks.reduce((acc, mark) => acc + mark.Likes.length, 0)}
              </IconLabel>
            </span>
          </div>
        </div>
      </div>
      {/* Marks Container with Scroll */}
      <div className="min-h-0 flex-1 border-border/30 border-x bg-card/60 backdrop-blur-sm">
        {marks.length ? (
          <ScrollArea className="h-full max-h-[calc(100vh-380px)]">
            <div className="space-y-3 p-3">
              {marks.map((mark, index) => (
                <Mark
                  key={mark.id}
                  mark={mark}
                  index={index}
                  withdel={withdel}
                  bookOwner={member}
                  followBooks={book?.FollowBook.length}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50">
              <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mb-1 text-muted-foreground text-sm">아직 Mark가 없습니다</p>
            <p className="text-muted-foreground/60 text-xs">첫 번째 Mark를 추가해보세요</p>
          </div>
        )}
      </div>
      {isMine && (
        <div className="rounded-b-2xl border-border/30 border-x border-b bg-card p-3">
          <Button
            variant={"glass"}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 border-dashed py-2.5 text-muted-foreground text-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <PlusIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>Mark 만들기</span>
          </Button>
        </div>
      )}
    </div>
  );
}
