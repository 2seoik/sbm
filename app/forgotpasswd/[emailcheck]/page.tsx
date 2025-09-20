import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ResetPassword from "../reset-passwd";

export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;

  const mbr = await prisma.member.findFirst({
    where: { emailcheck },
    select: { nickname: true, emailcheck: true, email: true },
  });

  if (emailcheck !== mbr?.emailcheck) {
    redirect("/sign/error?error=InvalidEmailCheck");
  }

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Reset your password</h1>
        <div className="mb-5 font-semibold text-gray-500">
          Hello, {mbr?.nickname}
        </div>
        <ResetPassword email={mbr?.email} emailcheck={emailcheck} />
      </div>
    </div>
  );
}
