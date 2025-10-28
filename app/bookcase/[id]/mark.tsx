"use client";

import {
  BookmarkXIcon,
  HatGlassesIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAlerter } from "@/hooks/contexts/alerter";
import { useStore } from "@/hooks/contexts/store";
import type { MarkAllColumn } from "@/lib/db";
import { deleteMark } from "./book.action";

export default function Mark({
  mark,
  withdel,
  bookOwner,
}: {
  mark: MarkAllColumn;
  withdel: boolean;
  bookOwner: number;
}) {
  const { iLikedMarks, iReportedMarks, toggleLikes, toggleReports } =
    useStore();

  const router = useRouter();
  const { alert } = useAlerter();

  const openLinkTrigger = async () => {
    // console.log("🚀 ~ mark.tsx ~ mark.id:", mark.id);
    // // '좋아요' 한 mark는 삭제에서 제외!
    // console.log("🚀 ~ mark.tsx ~ withdel:", withdel);
    // console.log(
    //   "🚀 ~ mark.tsx ~ !iLikedMarks.includes(mark.id):",
    //   !iLikedMarks.includes(mark.id)
    // );

    if (withdel && mark._count.Likes <= 0) {
      console.log("🚀 ~ mark.tsx ~ mark.id:", mark.id);
      try {
        await deleteMark(mark.id, bookOwner);
        router.refresh();
      } catch (err) {
        alert({ title: (err as Error).message });
      }
    }
  };

  // const likeOrReportsMarks = (
  //   e: MouseEvent<HTMLButtonElement>,
  //   type: "likes" | "reports"
  // ) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   type === "likes" ? toggleLikes(mark) : toggleReports(mark);
  // };

  const likeMarks = (e: MouseEvent<HTMLButtonElement>) => {
    // 버블링 막기위함
    e.preventDefault();
    e.stopPropagation();
    toggleLikes(mark);
  };

  const reportsMarks = (e: MouseEvent<HTMLButtonElement>) => {
    // 버블링 막기위함
    e.preventDefault();
    e.stopPropagation();
    toggleReports(mark);
  };

  return (
    // onclick Button, a
    <div className="group rounded-lg bg-white px-2 pt-2 pb-0.5 shadow-md hover:bg-slate-50 hover:shadow-lg">
      <Link
        href={mark.link}
        target="_blank"
        className="mark"
        rel="noopener noreferrer"
        onClick={openLinkTrigger}
      >
        <div className="flex items-center gap-2">
          <Avatar className="size-auto h-16 max-w-[50%] rounded-lg group-hover:ring-2 group-hover:ring-primary">
            <AvatarImage src={mark.image || "/bookmark_dummy.png"} />
            <AvatarFallback className="w-full">
              {mark.title.substring(0, 8)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden [&>*]:truncate">
            <h1 className="text-lg dark:text-black/70" title={mark.title}>
              {process.env.NODE_ENV === "development" && (
                <small className="text-muted-foreground">{mark.id} : </small>
              )}
              {mark.title}
            </h1>
            <small className="text-muted-foreground">
              {mark.descript || mark.title}
            </small>
            <small className="text-muted-foreground underline-offset-2 group-hover:underline">
              {mark.link}
            </small>
          </div>
        </div>

        <Separator className="mt-2 mb-0.5 bg-muted-foreground/30" />
        <div className="flex items-center justify-between text-sm">
          <IconLabelButton
            icon={<ThumbsUpIcon />}
            isActive={iLikedMarks.includes(mark.id)}
            onClick={(e) => likeMarks(e)}
          >
            {mark._count.Likes}
          </IconLabelButton>

          <IconLabelButton icon={<MessageCircleIcon />}>
            {mark._count.Talk}
          </IconLabelButton>

          <IconLabelButton
            icon={<HatGlassesIcon />}
            isActive={iReportedMarks.includes(mark.id)}
            onClick={(e) => reportsMarks(e)}
            isDanger
          >
            {mark._count.Report}
          </IconLabelButton>

          <IconLabelButton
            icon={<BookmarkXIcon className="size-5" />}
            tooltip="바로 삭제"
            isDanger
          />
          <IconLabelButton icon={<MoreHorizontalIcon />} />
        </div>
      </Link>
    </div>
  );
}
