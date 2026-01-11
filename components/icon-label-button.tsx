"use client";

import type { JSX, MouseEvent, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import IconLabel, { type IconNoti } from "./icon-label";
import ToolTip from "./tool-tip";
import { Button } from "./ui/button";

type ButtonVariant = "action" | "actionLike" | "actionComment" | "actionReport";

type Props = {
  icon: JSX.Element;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  isDanger?: boolean;
  tooltip?: string;
  disabled?: boolean;
  noti?: IconNoti;
  variant?: ButtonVariant;
};
export default function IconLabelButton({
  icon,
  onClick,
  isActive,
  isDanger,
  tooltip,
  disabled,
  noti,
  variant,
  children,
}: PropsWithChildren<Props>) {
  return (
    <ToolTip content={tooltip} disabled={!tooltip} variant={isDanger ? "destructive" : "default"}>
      <Button
        onClick={onClick}
        variant={variant}
        className={cn("h-7 gap-1.5 rounded-full px-2", isDanger && "text-destructive", noti ? "px-2" : "py-1", {
          "px-2": !children,
        })}
        disabled={disabled}
      >
        <IconLabel icon={icon} isActive={isActive} isDanger={isDanger} noti={noti}>
          {children}
        </IconLabel>
      </Button>
    </ToolTip>
  );
}
