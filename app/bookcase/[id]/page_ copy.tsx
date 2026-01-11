import { AlbumIcon, BookMarkedIcon, HeartPlusIcon, PlusIcon } from "lucide-react";
import { use } from "react";
import IconLabel from "@/components/icon-label";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { findMemberByIdWithCount } from "@/lib/db";
import Book from "./book";
import { getAllBooksByMember } from "./book.action";
import BookDialog from "./book-dialog";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookCaseNickname({ params }: Props) {
  const { id } = use(params); // params 이기 떄문에 string
  const session = use(auth());
  const userId = Number(session?.user.id);
  const isMyBookcase = session?.user.id === id; //!!session?.user;
  // const isMyBookcase = !!session?.user && session.user.id === id;
  const mbr = use(findMemberByIdWithCount(id));
  if (!mbr) return <h1 className="text-2xl">사용자가 없습니다.</h1>;

  const books = use(getAllBooksByMember(Number(id)));

  // books.forEach(book => {
  //   book.Mark.forEach(mark => {
  //     mark.iliked = mark.Likes.map((like) => like.memeber).includes(userId)
  //   })
  // })

  return (
    <div className="flex h-full flex-col pt-2">
      <h1 className="flex items-center justify-between px-5 font-semibold text-2xl">
        <div className="flex items-center tracking-wider">
          {/* <UserAvatar id={id} withName={true} /> */}
          {mbr && <UserAvatar member={mbr} withName={true} side="right" />}
          <span className="ml-2 font-medium text-green-600 tracking-tighter">Bookcase</span>
        </div>
        <span className="flex gap-3 text-lg">
          <IconLabel icon={<BookMarkedIcon />}>{mbr._count.Book}</IconLabel>
          <IconLabel icon={<AlbumIcon />} noti="secondary">
            {mbr._count.Mark}
          </IconLabel>
          <IconLabel icon={<HeartPlusIcon />} noti="success">
            {books.reduce((acc, book) => acc + book.FollowBook.length, 0)}
          </IconLabel>
        </span>
      </h1>

      <div className="h-full overflow-x-scroll">
        <div className="flex gap-3 py-2">
          {/* Book 컴포넌트 */}
          {books.length ? (
            books.map((book, index) => <Book key={book.id} book={book} index={index} />)
          ) : (
            <h1 className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-slate-200 p-3 pl-2 text-xl dark:bg-muted">
              <div className="rounded-lg bg-slate-50 p-3 text-center font-medium text-muted-foreground">
                Book이 없습니다.
              </div>
            </h1>
          )}

          {isMyBookcase && (
            <BookDialog>
              <Button
                variant={"ghost"}
                className="flex w-60 justify-start rounded-full bg-slate-200 font-semibold text-lg hover:bg-muted-foreground/30 dark:bg-muted dark:hover:bg-muted-foreground/30"
              >
                <PlusIcon /> Book 만들기
              </Button>
            </BookDialog>
          )}
        </div>
      </div>
    </div>
  );
}
