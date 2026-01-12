import { cloneElement, type JSX, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export type IconNoti = "default" | "secondary" | "destructive" | "success";
type Props = {
  icon: JSX.Element;
  size?: number;
  noti?: IconNoti;
  isActive?: boolean;
  isDanger?: boolean;
};

export default function IconLabel({ icon, size, isActive, isDanger, noti, children }: PropsWithChildren<Props>) {
  const lucideIcon = cloneElement(icon, {
    className: cn(
      "w-3.5 h-3.5",
      isDanger && "text-destructive",
      isActive && "fill-current",
      { "mr-1": !!noti, "mr-[.3rem]": !!children || children === 0 },
      icon.props?.className,
    ),
    size: size ?? (noti ? 25 : 20),
  });

  const cLen = children?.toString().length ?? 1;
  const transX = cLen > 1 ? cLen * 0.5 : cLen;

  return (
    <div className="relative flex items-center">
      {lucideIcon}
      {noti ? (
        <small
          className={cn(
            "absolute top-0 right-0 min-w-4 rounded-full p-0 text-center text-white text-xs tracking-tighter ring-1",
            `translate-x-${Math.min(transX, 5)} translate-y-[-.4rem]`,
            {
              "bg-primary-foreground": noti === "default",
              "bg-muted-foreground": noti === "secondary",
              "bg-destructive": noti === "destructive",
              "bg-green-500": noti === "success",
            },
          )}
        >
          {children}
        </small>
      ) : (
        <span className="font-medium text-xs">{children}</span>
      )}
    </div>
  );
}
