import { Loader2Icon } from "lucide-react";

type Props = {
  isPending: boolean;
  text: string;
};

export function LoadingIcon({ isPending, text }: Props) {
  // TODO : 다양한 형태로 들어오는 버튼 텍스트 대응필요 cf.resend-regist.tsx
  return isPending ? <Loader2Icon className="animate-spin" /> : `${text}`;
}
