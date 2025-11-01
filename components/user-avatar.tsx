"use client";

import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MemberWithCount } from "@/lib/db";
import { DummyProfiieFile } from "@/lib/utils";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type PartialExclude<T, R extends keyof T> = Partial<T> &
  Required<Pick<T, R>>;

// type X = PartialExclude<NonNullable<MemberWithCount>, 'id'>;
// const x: X = { id: 1, image: 'xx', nickname: 'xx', isadmin: false };
// console.log('🚀 ~ x:', x);

type Props = {
  member: PartialExclude<NonNullable<MemberWithCount>, "id" | "nickname">;
  withName?: boolean;
  side?: "bottom" | "top" | "right" | "left";
};

export default function UserAvatar({ member, withName, side }: Props) {
  const isMobile = useIsMobile();

  if (!member)
    return (
      <Avatar>
        <AvatarImage src={"/profile_dummy.png"} />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );

  const Card = isMobile ? Popover : HoverCard;
  const Trigger = isMobile ? PopoverTrigger : HoverCardTrigger;
  const Content = isMobile ? PopoverContent : HoverCardContent;

  return (
    <div className="flex items-center gap-1">
      <Card>
        <Trigger asChild>
          <Button
            variant="link"
            className="touch-none p-0 md:pointer-events-auto md:touch-auto"
          >
            <Avatar>
              <AvatarImage src={member.image || DummyProfiieFile} />
              <AvatarFallback className="text-xl">
                {member.nickname.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </Trigger>
        {member._count && (
          <Content className="w-auto max-w-80" side={side}>
            <div className="flex justify-between gap-1">
              <div className="w-20">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.image || DummyProfiieFile} />
                  <AvatarFallback>-</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-shrink-0 space-y-1">
                <h4 className="font-semibold text-sm">@{member.nickname}</h4>
                <p className="text-muted-foreground text-sm">{member.email}</p>
                <div className="text-muted-foreground text-xs">
                  {member._count.Book} Books
                  {member._count.Mark} Marks 00 Followers
                </div>
              </div>
            </div>
          </Content>
        )}
      </Card>
      {withName && decodeURI(member.nickname)}
    </div>
  );
}
