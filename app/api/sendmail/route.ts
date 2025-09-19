import { type NextRequest, NextResponse } from "next/server";
import { sendPasswordReset, sendRegistCheck } from "@/app/sign/mail.actions";

type SendMailBody = {
  email: string;
  emailcheck: string;
  nickname?: string;
  emailType?: "regist" | "resetPassword";
};

// api/sendmail
export async function POST(req: NextRequest) {
  const {
    email,
    emailcheck,
    nickname,
    emailType = "regist",
  }: SendMailBody = await req.json();

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.INTERNAL_SECRET}`)
    throw new Error("토큰값이 일치하지 않습니다.");

  const rs =
    emailType === "regist"
      ? await sendRegistCheck(email, emailcheck)
      : await sendPasswordReset(email, emailcheck, nickname);

  return NextResponse.json(rs);
}
