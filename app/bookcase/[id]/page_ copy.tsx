import { AlbumIcon, BookMarkedIcon, FilterIcon, HeartPlusIcon, PlusIcon, SearchIcon, SparklesIcon } from "lucide-react";
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
    <>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
              <SparklesIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              {mbr && <UserAvatar member={mbr} withName={true} side="right" />}
              <h1 className="font-bold font-display text-2xl text-foreground sm:text-3xl">내 컬렉션1</h1>
            </div>
          </div>
          <p className="ml-12 text-muted-foreground">북마크 컬렉션을 관리하고 새로운 인사이트를 발견하세요.</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* {[
            { label: "전체 Book", value: mockBooks.length, icon: Bookmark, color: "text-primary" },
            {
              label: "전체 Mark",
              value: mockBooks.reduce((acc, b) => acc + b.marks.length, 0),
              icon: Globe,
              color: "text-accent",
            },
            { label: "이번 주 추가", value: 12, icon: TrendingUp, color: "text-emerald-400" },
            { label: "최근 활동", value: "2시간 전", icon: Clock, color: "text-orange-400" },
          ].map((stat, idx) => (
            <div key={idx} className="glass rounded-xl p-4">
              <div className="mb-1 flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-muted-foreground text-xs">{stat.label}</span>
              </div>
              <p className="font-display font-semibold text-foreground text-lg">{stat.value}</p>
            </div>
          ))} */}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="group relative">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Book 또는 Mark 검색..."
                className="w-48 rounded-xl border border-border/50 bg-secondary/50 py-2.5 pr-4 pl-10 text-foreground text-sm transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/10 sm:w-64"
              />
            </div>

            {/* Filter */}
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <FilterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">필터</span>
            </Button>
          </div>

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
            <Button variant="hero" size="sm" className="gap-2 rounded-xl">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">새 Book</span>
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="-mx-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-x-auto px-4 pb-6">
          <div className="flex gap-4 lg:gap-6">
            {/* {mockBooks.map((book, idx) => (
              <BookColumn key={book.id} book={book} index={idx} onAddMark={handleAddMark} />
            ))} */}

            {/* Add New Book Column */}
            <div
              className="w-[300px] flex-shrink-0 animate-fade-in opacity-0 sm:w-[340px] lg:w-[360px]"
              // style={{ animationDelay: `${mockBooks.length * 0.1}s`, animationFillMode: "forwards" }}
            >
              <button className="group flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-border/40 border-dashed text-muted-foreground transition-all hover:border-primary/40 hover:bg-card/50 hover:text-primary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 transition-colors group-hover:bg-primary/10">
                  <PlusIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                </div>
                <span className="font-medium">새 Book 만들기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
