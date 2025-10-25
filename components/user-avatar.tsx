import { AvatarFallback } from "@radix-ui/react-avatar";
import { use } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { findMemberByIdWithCount, type MemberWithCount } from "@/lib/db";
import { DummyProfiieFile } from "@/lib/utils";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props =
  | {
      id: string | number;
      member?: undefined;
      withName?: boolean;
    }
  | {
      member: NonNullable<MemberWithCount>;
      id?: undefined;
      withName?: boolean;
    };

export default function UserAvatar({ id, member, withName }: Props) {
  const mbr = member ? member : use(findMemberByIdWithCount(id));

  if (!mbr)
    return (
      <Avatar>
        <AvatarImage src={DummyProfiieFile} />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );

  return (
    <div className="flex items-center gap-1">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="border">
            <AvatarImage src={mbr.image || DummyProfiieFile} />
            <AvatarFallback>{mbr.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto max-w-80">
          <div className="flex justify-between gap-1">
            <div className="w-20">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mbr.image || DummyProfiieFile} />
                <AvatarFallback>-</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">@{mbr.nickname}</h4>
              <p className="text-muted-foreground text-xs">{mbr.email}</p>
              <div className="text-muted-foreground text-xs">
                {mbr._count.Book} Books
                {mbr._count.Mark} Marks 00 Followers
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      {withName && decodeURI(mbr.nickname)}
    </div>
  );
}
