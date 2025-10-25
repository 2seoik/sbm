"use client";

import { type PropsWithChildren, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  content: ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
};

export default function ToolTip({
  content,
  variant,
  disabled,
  children,
}: PropsWithChildren<Props>) {
  const [isOpen, setOpen] = useState(false);

  const doOpen = (openState: boolean) => {
    setOpen(disabled ? false : openState);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={doOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {/* shadcn 을 직접적으로 커스텀하여 사용하는 예시 */}
      <TooltipContent
        className={cn(
          "text-white",
          variant === "destructive" && "bg-destructive"
        )}
        arrowClassName={cn(
          variant === "destructive" && "fill-destructive bg-destructive"
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
