"use client";

import {
  BookmarkXIcon,
  GlobeIcon,
  HatGlassesIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ThumbsUp,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type MouseEvent, useOptimistic, useTransition } from "react";
import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Img from "@/components/ui/img";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import { deleteMark, toggleLikesOrReportMark } from "./book.action";
import MarkDialog from "./mark-dialog";

export default function Mark({
  mark,
  index,
  withdel,
  bookOwner,
  followBooks,
}: {
  mark: MarkAllColumn;
  index: number;
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

  const likeOrReportMark = (e: MouseEvent<HTMLButtonElement>, type: "likes" | "reports") => {
    e.preventDefault();
    e.stopPropagation();

    const hasNow = type === "likes" ? iLiked() : iReported();
    // const state = type === "likes" ? likes : reports;
    // const setAction = type === "likes" ? setLikes : setReports;
    const col = type === "likes" ? mark.Likes : mark.Report;
    const dbData = hasNow ? col.filter(({ member }) => member !== userId) : [...col, { member: userId }];

    const startTransition = type === "likes" ? startTransitionLike : startTransitionReport;

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

  const likeMark = (e: MouseEvent<HTMLButtonElement>) => likeOrReportMark(e, "likes");
  const reportMark = (e: MouseEvent<HTMLButtonElement>) => likeOrReportMark(e, "reports");

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
    <div
      className="group relative cursor-pointer rounded-xl border border-border/30 bg-secondary/30 p-3 transition-all duration-300 hover:border-primary/20 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-background/50">
        <Img
          src={mark.image || `https://avatar.vercel.sh/${mark.title}`}
          alt={mark.title.substring(0, 8)}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="space-y-2">
        <h4 className="line-clamp-2 font-medium text-foreground text-sm leading-snug transition-colors group-hover:text-primary">
          {mark.title}
        </h4>
        <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">{mark.descript}</p>
        <Link
          href={mark.link}
          target="_blank"
          className="inline-flex max-w-full items-center gap-1 truncate text-primary/60 text-xs transition-colors hover:text-primary"
          rel="noopener noreferrer"
          onClick={openLinkTrigger}
        >
          <GlobeIcon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{new URL(mark.link).hostname}</span>
        </Link>
        {bookOwner !== mark.maker && <div className="w-1/5">{mark.Member && <UserAvatar member={mark.Member} />}</div>}
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-1 border-border/20 border-t pt-3">
        {/* 좋아요 */}
        <IconLabelButton
          btnType="like"
          icon={<ThumbsUpIcon />}
          onClick={likeMark}
          isActive={iLiked()}
          disabled={isLikePending}
        >
          <span>{likes.length}</span>
        </IconLabelButton>

        {/* 채팅 */}
        <IconLabelButton icon={<MessageCircleIcon />} btnType="comment">
          {mark.Talk.length}
        </IconLabelButton>

        {/* <button className="group/btn flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
            <span>{mark.commentCount}</span>
          </button> */}

        {/* 신고 */}
        <IconLabelButton
          btnType="report"
          icon={<HatGlassesIcon />}
          onClick={reportMark}
          isActive={iReported()}
          disabled={isReportPending}
        >
          {reports.length}
        </IconLabelButton>

        {/* 삭제 */}
        {hasAuth && (
          <>
            <IconLabelButton
              btnType="delete"
              onClick={removeMark}
              icon={<Trash2Icon className="size-5" />}
              tooltip="바로 삭제"
              disabled={isRemovePending}
              isDanger
            />
            {/* 수정 */}
            <div className="ml-auto h-7 w-7 opacity-0 hover:text-primary group-hover:opacity-100">
              <MarkDialog mark={mark}>
                <IconLabelButton icon={<MoreHorizontalIcon />} />
              </MarkDialog>
            </div>
          </>
        )}

        {/* <button className="group/btn flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-primary">
            <Share2 className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
            <span>{mark.shareCount}</span>
          </button>
          <button className="ml-auto rounded-md p-1 opacity-0 transition-colors hover:bg-secondary group-hover:opacity-100">
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </button> */}
      </div>
    </div>
  );
}
