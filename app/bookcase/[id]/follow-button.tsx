"use client";

import { HeartIcon, HeartPlusIcon } from "lucide-react";
import { type PropsWithChildren, useTransition } from "react";
import type { IconNoti } from "@/components/icon-label";
import IconLabelButton from "@/components/icon-label-button";
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
    <IconLabelButton
      onClick={toggleFollow}
      icon={<HeartIcon className="size-6" />}
      // noti={noti}
      isActive={isActive}
      disabled={isPending}
      variant="action"
    >
      {children}
    </IconLabelButton>
  );
}

// followBooks.map(({ member }) => member).includes(loginUserId)
