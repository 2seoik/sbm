"use client";

import type { JSX, MouseEvent, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import IconLabel, { type IconNoti } from "./icon-label";
import ToolTip from "./tool-tip";
import { Button } from "./ui/button";

type ButtonType = "default" | "like" | "comment" | "report" | "delete";
type ButtonConfig = {
  activeClass?: string;
  hoverClass?: string;
  fillOnActive: boolean;
};

type Props = {
  icon: JSX.Element;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  isDanger?: boolean;
  tooltip?: string;
  disabled?: boolean;
  noti?: IconNoti;
  btnType?: ButtonType;
};

const buttonConfigs: Record<ButtonType, ButtonConfig> = {
  default: {
    activeClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    hoverClass: "hover:bg-primary/10 hover:text-primary",
    fillOnActive: false,
  },
  like: {
    activeClass: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25",
    fillOnActive: true,
  },
  comment: {
    activeClass: "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25",
    fillOnActive: true,
  },
  report: {
    activeClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25",
    fillOnActive: true,
  },
  delete: {
    hoverClass: "hover:bg-destructive/10 hover:text-destructive",
    fillOnActive: false,
  },
};

export default function IconLabelButton({
  icon,
  onClick,
  isActive,
  isDanger,
  tooltip,
  disabled,
  noti,
  btnType = "default",
  children,
}: PropsWithChildren<Props>) {
  const config = buttonConfigs[btnType];
  if (!config) return null;

  return (
    <ToolTip content={tooltip} disabled={!tooltip} variant={isDanger ? "destructive" : "default"}>
      <Button
        onClick={onClick}
        variant={isActive ? "default" : "action"}
        className={cn(
          "h-7 gap-1.5 rounded-full px-2 transition-all duration-200",
          isActive ? config.activeClass : config.hoverClass,
          isDanger && "text-destructive",
          noti ? "px-2" : "py-1",
          {
            "px-2": !children,
          },
        )}
        disabled={disabled}
      >
        <IconLabel icon={icon} isActive={isActive} isDanger={isDanger} noti={noti}>
          {children}
        </IconLabel>
      </Button>
    </ToolTip>
  );
}
