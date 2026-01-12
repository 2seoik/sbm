"use client";

import { HeartIcon, HeartPlusIcon, UserMinusIcon, UserPlusIcon } from "lucide-react";
import { type PropsWithChildren, useTransition } from "react";
import type { IconNoti } from "@/components/icon-label";
import IconLabelButton from "@/components/icon-label-button";
import { Button } from "@/components/ui/button";
import { useAlerter } from "@/hooks/contexts/alerter";
import { toggleFollowBook } from "./book.action";

type Props = {
  bookId: number;
  bookOwner: number;
  isActive: boolean;
  noti?: IconNoti;
};

export default function FollowButton({ bookId, bookOwner, isActive, children, noti }: PropsWithChildren<Props>) {
  const { alert } = useAlerter();
  const [isPending, startTransition] = useTransition();

  const toggleFollow = () => {
    startTransition(async () => {
      try {
        await toggleFollowBook(bookId, bookOwner);
      } catch (error) {
        alert(null, error);
      }
    });
  };

  return (
    <Button
      variant={isActive ? "outline" : "default"}
      size="sm"
      className="h-8 flex-shrink-0 gap-1.5 px-3"
      onClick={toggleFollow}
    >
      {isActive ? (
        <>
          <UserMinusIcon className="h-3.5 w-3.5" />
          <span className="text-xs">언팔로우</span>
        </>
      ) : (
        <>
          <UserPlusIcon className="h-3.5 w-3.5" />
          <span className="text-xs">팔로우</span>
        </>
      )}
    </Button>
  );
  // return (
  //   <IconLabelButton
  //     onClick={toggleFollow}
  //     icon={<HeartIcon className="size-6" />}
  //     // noti={noti}
  //     isActive={isActive}
  //     disabled={isPending}
  //     variant="action"
  //   >
  //     {children}
  //   </IconLabelButton>
  // );
}
