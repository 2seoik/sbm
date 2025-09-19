import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ error: string; email?: string; emailcheck?: string }>;
};

const getMessage = (err: string) => {
  if (err === "InvalidEmailCheck") return "유효하지 않은 이메일 인증키 입니다.";
  if (err === "CheckEmail") return "이메일을 확인해주세요.";
};

export default function AuthError({ searchParams }: Props) {
  const { error, email, emailcheck } = use(searchParams);

  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <h1 className="mb-5 font-semibold text-2xl">{error}</h1>
        <div className="mb-5 text-red-500">{getMessage(error)}</div>

        <div className="flex justify-center gap-2">
          <Button variant={"outline"} asChild={true}>
            <Link href={`/sign?email=${email}`} className="w-full">
              Go to Login
            </Link>
          </Button>
          {error === "CheckEmail" && emailcheck && (
            <Button variant={"primary"}>
              Resend Email to <strong>{email}</strong>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
