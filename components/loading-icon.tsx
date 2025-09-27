import { Loader2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isPending: boolean;
}>;

export function LoadingIcon(props: Props) {
  const { isPending, children } = props;
  // TODO : 다양한 형태로 들어오는 버튼 텍스트 대응필요 cf.resend-regist.tsx
  return isPending ? <Loader2Icon className="animate-spin" /> : <>{children}</>;
}
