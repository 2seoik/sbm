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
import UserAvatar from "@/components/user-avatar";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import { deleteMark, toggleLikesOrReportMark } from "./book.action";
import MarkDialog from "./mark-dialog";

export default function Mark({
  mark,
  withdel,
  bookOwner,
  followBooks,
}: {
  mark: MarkAllColumn;
  withdel: boolean;
  bookOwner: number;
  followBooks?: number;
}) {
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  const hasAuth = userId === mark.maker || userId === bookOwner;

  // useOptimistic(state, (_prev, optimisticValue) => { ... })  형태로 도 사용가능
  const [likes, setLikes] = useOptimistic(mark.Likes);
  const [reports, setReports] = useOptimistic(mark.Report);

  const [isLikePending, startTransitionLike] = useTransition();
  const [isReportPending, startTransitionReport] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();

  const router = useRouter();
  const { alert, confirm } = useAlerter();

  const iLiked = () => likes.map(({ member }) => member).includes(userId);
  const iReported = () => reports.map(({ member }) => member).includes(userId);

  const likeOrReportMark = (
    e: MouseEvent<HTMLButtonElement>,
    type: "likes" | "reports"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const hasNow = type === "likes" ? iLiked() : iReported();
    // const state = type === "likes" ? likes : reports;
    // const setAction = type === "likes" ? setLikes : setReports;
    const col = type === "likes" ? mark.Likes : mark.Report;
    const dbData = hasNow
      ? col.filter(({ member }) => member !== userId)
      : [...col, { member: userId }];

    const startTransition =
      type === "likes" ? startTransitionLike : startTransitionReport;

    startTransition(async () => {
      try {
        // if (hasNow) {
        //   // mark.Likes = mark.Likes.filter((like) => like.member !== userId);
        //   setAction(state.filter(({ member }) => member !== userId));
        // } else {
        //   // mark.Likes.push({ member: userId });
        //   // mark.Likes = [...mark.Likes, { member: userId }];
        //   setAction([...state, { member: userId }]);
        // }

        (type === "likes" ? setLikes : setReports)(dbData);
        await toggleLikesOrReportMark(mark.id, type, bookOwner);

        // unstable_cache 사용하므로 주석!
        // if (type === "likes") mark.Likes = dbData;
        // else mark.Report = dbData;
        // 사용자가 많아질수록 부담이 될수있음...!!
        // router.refresh();
      } catch (err) {
        if (err instanceof Error) alert({ title: err.message });
        else alert({ title: JSON.stringify(err) });
      }
    });
  };

  const likeMark = (e: MouseEvent<HTMLButtonElement>) =>
    likeOrReportMark(e, "likes");
  const reportMark = (e: MouseEvent<HTMLButtonElement>) =>
    likeOrReportMark(e, "reports");

  const openLinkTrigger = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // '좋아요' 한 mark는 삭제에서 제외!
    if (!withdel || mark.Likes.length) return;

    removeMark();
    // try {
    //   await deleteMark(mark.id, bookOwner);
    //   router.refresh();
    // } catch (error) {
    //   alert(null, error);
    // }
  };

  const removeMark = async (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!!followBooks || !!mark.Likes.length || !withdel) {
      const ret = await confirm({ title: "삭제 하시겠습니까?" });
      if (!ret) return;
    }

    startRemoveTransition(async () => {
      try {
        await deleteMark(mark.id, bookOwner);
        // router.refresh();
      } catch (error) {
        await alert(null, error);
      }
    });
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
          <Avatar className="h-16 w-auto max-w-[50%] rounded-lg group-hover:ring-2 group-hover:ring-primary">
            <AvatarImage
              src={mark.image || `https://avatar.vercel.sh/${mark.title}`}
              className="aspect-auto w-auto"
            />
            <AvatarFallback className="w-full">
              {mark.title.substring(0, 8)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden [&>*]:truncate">
            <h1 className="text-lg dark:text-black/70" title={mark.title}>
              {process.env.NODE_ENV === "development" && (
                <small className="text-muted-foreground">{mark.id}</small>
              )}
              {process.env.NODE_ENV === "development" && (
                <small className="text-red-500"> : {mark.maker}</small>
              )}
              {mark.title}
            </h1>
            <div className="flex">
              <div className="w-full min-w-4/5">
                <div className="truncate text-muted-foreground text-xs">
                  {mark.descript || mark.title}
                </div>
                <div className="truncate text-muted-foreground text-sm underline-offset-2 group-hover:underline">
                  {mark.link}
                </div>
              </div>
              {bookOwner !== mark.maker && (
                <div className="w-1/5">
                  {mark.Member && <UserAvatar member={mark.Member} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
      <Separator className="mt-2 mb-0.5 bg-muted-foreground/30" />
      <div
        className={cn(
          "flex items-center text-sm",
          hasAuth ? "justify-between" : "justify-around"
        )}
      >
        {/* 좋아요 */}
        <IconLabelButton
          icon={<ThumbsUpIcon />}
          // onClick={(e) => likeOrReportMark(e, "likes")}
          onClick={likeMark}
          isActive={iLiked()}
          disabled={isLikePending}
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
          disabled={isReportPending}
          isDanger
        >
          {reports.length}
        </IconLabelButton>

        {/* 삭제 */}
        {hasAuth && (
          <>
            <IconLabelButton
              onClick={removeMark}
              icon={<BookmarkXIcon className="size-5" />}
              tooltip="바로 삭제"
              disabled={isRemovePending}
              isDanger
            />
            <MarkDialog mark={mark}>
              <IconLabelButton icon={<MoreHorizontalIcon />} />
            </MarkDialog>
          </>
        )}
      </div>
    </div>
  );
}
