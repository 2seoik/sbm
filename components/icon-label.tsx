import { cloneElement, type JSX, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon: JSX.Element;
  size?: number;
  noti?: "default" | "muted" | "destructive" | "primary" | "success";
};
export default function IconLabel({
  icon,
  size,
  noti,
  children,
}: PropsWithChildren<Props>) {
  const lucideIcon = cloneElement(icon, {
    className: cn(
      "text-muted-foreground mr-[0.1rem]",
      { "mr-3": noti },
      icon.props.className
    ),
    size: size ?? (noti ? 28 : 20),
  });

  return (
    <div className="relative flex items-center gap-1">
      {lucideIcon}
      {noti ? (
        <small
          className={cn(
            "absolute top-0 right-0 min-w-5 rounded-full text-center text-sm text-white tracking-tighter ring-1",
            `translate-x-${
              (children?.toString().length ?? 0) + 1
            } translate-y-[-0.4rem]`,
            {
              "bg-black": noti === "default",
              "bg-gray-500": noti === "muted",
              "bg-red-500": noti === "destructive",
              "bg-blue-500": noti === "primary",
              "bg-green-500": noti === "success",
            }
          )}
        >
          {children}
        </small>
      ) : (
        children
      )}
    </div>
  );
}
