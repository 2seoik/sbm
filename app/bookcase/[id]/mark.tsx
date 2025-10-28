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
  // const [likes, setLikes] = useState(() => mark.Likes);
  const [likes, setLikes] = useOptimistic(mark.Likes);
  const [reports, setReports] = useOptimistic(mark.Report);

  const [isPending, startTransition] = useTransition();
  // const { iLikedMarks, iReportedMarks, toggleLikes, toggleReports } = useStore();
  const router = useRouter();
  const { alert } = useAlerter();

  const iLiked = () => likes.map(({ member }) => member).includes(userId);
  const iReported = () =>
    mark.Report.map((like) => like.member).includes(userId);

  const likeOrReportMark = (
    e: MouseEvent<HTMLButtonElement>,
    type: "likes" | "reports"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // toggleLikes(mark);

    const hasNow = type === "likes" ? iLiked() : iReported();
    const state = type === "likes" ? likes : reports;
    const setAction = type === "likes" ? setLikes : setReports;
    const col = type === "likes" ? mark.Likes : mark.Report;
    const dbData = hasNow
      ? col.filter(({ member }) => member !== userId)
      : [...mark.Likes, { member: userId }];

    startTransition(async () => {
      try {
        if (iLiked()) {
          // mark.Likes = mark.Likes.filter((like) => like.member !== userId);
          setAction(state.filter(({ member }) => member !== userId));
        } else {
          // mark.Likes = [...mark.Likes, { member: userId }];
          // mark.Likes.push({ member: userId });
          setAction([...likes, { member: userId }]);
          // mark.Likes = [...mark.Likes, { member: userId }];
        }

        if (type === "likes") mark.Likes = dbData;
        else mark.Report = dbData;

        await toggleLikesOrReportMark(mark.id, "likes");
      } catch (error) {
        if (error instanceof Error) alert({ title: error.message });
        else alert({ title: JSON.stringify(error) });
      }
    });
  };

  const reportMark = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // toggleReports(mark);
  };

  const openLinkTrigger = async () => {
    // console.log("🚀 ~ mark.tsx ~ mark.id:", mark.id);
    // // '좋아요' 한 mark는 삭제에서 제외!
    // console.log("🚀 ~ mark.tsx ~ withdel:", withdel);
    // console.log(
    //   "🚀 ~ mark.tsx ~ !iLikedMarks.includes(mark.id):",
    //   !iLikedMarks.includes(mark.id)
    // );

    if (withdel && mark.Likes.length) return;

    console.log("🚀 ~ mark.tsx ~ mark.id:", mark.id);

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
        <IconLabelButton
          icon={<ThumbsUpIcon />}
          // onClick={likeMark}
          onClick={(e) => likeOrReportMark(e, "likes")}
          // isActive={iLikedMarks.includes(mark.id)}
          isActive={iLiked()}
          disabled={isPending}
        >
          {/* {mark._count.Likes}:  */}
          {likes.length}
        </IconLabelButton>
        <IconLabelButton icon={<MessageCircleIcon />}>
          {/* {mark._count.Talk} : */}
          {mark.Report.length}
        </IconLabelButton>
        <IconLabelButton
          icon={<HatGlassesIcon />}
          onClick={(e) => likeOrReportMark(e, "reports")}
          isDanger={iReported()}
          disabled={isPending}
        >
          {/* {mark._count.Report} */}
          {mark.Report.length}
        </IconLabelButton>
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
