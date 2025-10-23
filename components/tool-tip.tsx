import type { PropsWithChildren, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ToolTip({
  content,
  children,
}: PropsWithChildren<{ content: ReactNode }>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {/* shadcn 을 직접적으로 커스텀하여 사용하는 예시 */}
      <TooltipContent
        className="bg-red-500"
        arrowClassName="fill-red-500 bg-red-500"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
