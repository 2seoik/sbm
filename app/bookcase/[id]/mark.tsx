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
import { useSession } from "next-auth/react";
import { type MouseEvent, useOptimistic, useTransition } from "react";
import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkAllColumn } from "@/lib/db";
import { deleteMark, toggleLikesOrReportMark } from "./book.action";

export default function Mark({
  mark,
  withdel,
  bookOwner,
}: {
  mark: MarkAllColumn;
  withdel: boolean;
  bookOwner: number;
}) {
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  const [likes, setLikes] = useOptimistic(mark.Likes); // ((pre) => {}) dispatch 함수스타일도 가능
  const [reports, setReports] = useOptimistic(mark.Report);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { alert } = useAlerter();

  const iLiked = () => likes.map(({ member }) => member).includes(userId);
  const iReported = () => reports.map(({ member }) => member).includes(userId);

  const likeOrReportMark = (
    e: MouseEvent<HTMLButtonElement>,
    type: "likes" | "reports"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const hasNow = type === "likes" ? iLiked() : iReported();
    const state = type === "likes" ? likes : reports;
    const setAction = type === "likes" ? setLikes : setReports;
    const col = type === "likes" ? mark.Likes : mark.Report;
    const dbData = hasNow
      ? col.filter(({ member }) => member !== userId)
      : [...mark.Likes, { member: userId }];

    startTransition(async () => {
      try {
        if (hasNow) {
          // mark.Likes = mark.Likes.filter((like) => like.member !== userId);
          setAction(state.filter(({ member }) => member !== userId));
        } else {
          // mark.Likes.push({ member: userId });
          // mark.Likes = [...mark.Likes, { member: userId }];
          setAction([...state, { member: userId }]);
        }

        await toggleLikesOrReportMark(mark.id, type);

        if (type === "likes") mark.Likes = dbData;
        else mark.Report = dbData;
      } catch (err) {
        if (err instanceof Error) alert({ title: err.message });
        else alert({ title: JSON.stringify(err) });
      }
    });
  };

  const likeMark = (e: MouseEvent<HTMLButtonElement>) =>
    likeOrReportMark(e, "likes");
  const reportMark = () => (e: MouseEvent<HTMLButtonElement>) =>
    likeOrReportMark(e, "reports");

  const openLinkTrigger = async () => {
    // console.log("🚀 ~ mark.tsx ~ mark.id:", mark.id);
    // // '좋아요' 한 mark는 삭제에서 제외!
    // console.log("🚀 ~ mark.tsx ~ withdel:", withdel);
    // console.log(
    //   "🚀 ~ mark.tsx ~ !iLikedMarks.includes(mark.id):",
    //   !iLikedMarks.includes(mark.id)
    // );

    if (!withdel || mark.Likes.length) return;

    try {
      await deleteMark(mark.id, bookOwner);
      router.refresh();
    } catch (err) {
      alert({ title: (err as Error).message });
    }
  };

  return (
    <div className="group rounded-lg bg-white px-2 pt-2 pb-0.5 shadow-md hover:bg-slate-50 hover:shadow-lg">
      {/* onclick 의 이벤트가 가능한 태그 Button, a */}
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
                <small>{mark.id}</small>
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
      </Link>
      <Separator className="mt-2 mb-0.5 bg-muted-foreground/30" />
      <div className="flex items-center justify-between text-sm">
        {/* 좋아요 */}
        <IconLabelButton
          icon={<ThumbsUpIcon />}
          // onClick={(e) => likeOrReportMark(e, "likes")}
          onClick={likeMark}
          isActive={iLiked()}
          disabled={isPending}
        >
          {likes.length}
        </IconLabelButton>

        {/* 채팅 */}
        <IconLabelButton icon={<MessageCircleIcon />}>
          {mark.Talk.length}
        </IconLabelButton>

        {/* 신고 */}
        <IconLabelButton
          icon={<HatGlassesIcon />}
          // onClick={(e) => likeOrReportMark(e, "reports")}
          onClick={reportMark}
          isActive={iReported()}
          disabled={isPending}
          isDanger
        >
          {reports.length}
        </IconLabelButton>

        {/* 삭제 */}
        <IconLabelButton
          icon={<BookmarkXIcon className="size-5" />}
          tooltip="바로 삭제"
          isDanger
        />
        <IconLabelButton icon={<MoreHorizontalIcon />} />
      </div>
    </div>
  );
}
