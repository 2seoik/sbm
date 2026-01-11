import {
  AlbumIcon,
  BookIcon,
  BookMarkedIcon,
  BookmarkIcon,
  FilterIcon,
  HeartPlusIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
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
  // const userId = Number(session?.user.id);
  const isMyBookcase = session?.user.id === id; //!!session?.user;
  // const isMyBookcase = !!session?.user && session.user.id === id;

  const mbr = use(findMemberByIdWithCount(id));

  if (!mbr)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 font-bold text-2xl text-foreground">BookCase를 찾을 수 없습니다</h1>
        <p className="mb-6 text-muted-foreground">요청하신 BookCase가 존재하지 않거나 삭제되었습니다.</p>
      </div>
    );

  const books = use(getAllBooksByMember(Number(id)));

  // books.forEach(book => {
  //   book.Mark.forEach(mark => {
  //     mark.iliked = mark.Likes.map((like) => like.memeber).includes(userId)
  //   })
  // })

  return (
    <>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            {mbr && <UserAvatar member={mbr} withName={false} side="right" size="lg" />}
            <div>
              <h1 className="font-bold font-display text-2xl text-foreground sm:text-3xl">
                {isMyBookcase ? "내 서재" : `${mbr.nickname}의 서재`}
              </h1>
            </div>
          </div>
          <p className="ml-12 text-muted-foreground">북마크 컬렉션을 관리하고 새로운 인사이트를 발견하세요.</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "전체 Book", value: mbr._count.Book, icon: BookIcon, color: "text-primary" },
            {
              label: "전체 Mark",
              value: mbr._count.Mark,
              icon: BookMarkedIcon,
              color: "text-accent",
            },
          ].map((stat, idx) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="mb-1 flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-muted-foreground text-xs">{stat.label}</span>
              </div>
              <p className="font-display font-semibold text-foreground text-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* <div className="flex items-center gap-3">
            <div className="group relative">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Book 또는 Mark 검색..."
                className="w-48 rounded-xl border border-border/50 bg-secondary/50 py-2.5 pr-4 pl-10 text-foreground text-sm transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/10 sm:w-64"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <FilterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">필터</span>
            </Button>
          </div> */}

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            {/* <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-secondary/50 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded-lg p-2 transition-all ${
                  viewMode === "kanban"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Rows3 className="h-4 w-4" />
              </button>
            </div> */}

            {/* Create Button */}
            {isMyBookcase && (
              <BookDialog>
                <Button variant="hero" className="gap-2 rounded-xl">
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">새 Book</span>
                </Button>
              </BookDialog>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="-mx-4 overflow-x-auto px-4 pb-4">
          <div className="flex min-w-max gap-4">
            {books.length ? (
              books.map((book, index) => <Book key={book.id} book={book} index={index} />)
            ) : (
              <h1 className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-slate-200 p-3 pl-2 text-xl dark:bg-muted">
                <div className="rounded-lg bg-slate-50 p-3 text-center font-medium text-muted-foreground">
                  Book이 없습니다.
                </div>
              </h1>
            )}

            {/* {mockBooks.map((book, idx) => (
              <BookColumn key={book.id} book={book} index={idx} onAddMark={handleAddMark} />
            ))} */}

            {/* Add New Book Column */}
            {/* <div
              className="w-[300px] flex-shrink-0 animate-fade-in opacity-0 sm:w-[340px] lg:w-[360px]"
              style={{ animationFillMode: "forwards" }}
            >
              <button className="group flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-border/40 border-dashed text-muted-foreground transition-all hover:border-primary/40 hover:bg-card/50 hover:text-primary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 transition-colors group-hover:bg-primary/10">
                  <PlusIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                </div>
                <span className="font-medium">새 Book 만들기</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
