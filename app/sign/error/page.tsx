import Link from "next/link";
import { use } from "react";
import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";
import ResendRegist from "./resend-regist";

type Props = {
  searchParams: Promise<{ error: string; email?: string; emailcheck?: string }>;
};

const getMessage = (err: string) => {
  if (err === "InvalidEmailCheck") return "유효하지 않은 이메일 인증키 입니다.";
  if (err === "CheckEmail") return "이메일을 확인해주세요.";
  if (err === "EmailSendFail") return "Cannot send email!";
};

export default function AuthError({ searchParams }: Props) {
  const { error, email, emailcheck } = use(searchParams);

  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <h1 className="mb-5 font-semibold text-2xl">{error}</h1>
        <div className="mb-10 text-red-500">{getMessage(error)}</div>

        <div className="item-center flex flex-col gap-3">
          <Button variant={"outline"} asChild={true}>
            <Link href={`/sign?email=${email}`} className="">
              Go to Login
            </Link>
          </Button>
          {error === "CheckEmail" && email && emailcheck && (
            <>
              <Divider label="or" />
              <ResendRegist email={email} emailcheck={emailcheck} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
