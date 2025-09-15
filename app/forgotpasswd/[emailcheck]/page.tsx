import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;

  const mbr = await prisma.member.findFirst({
    select: { nickname: true, emailcheck: true, email: true },
    where: { emailcheck },
  });

  if (!mbr) {
    return <h1>Error</h1>;
  }

  const resetPassword = async () => {
    "use server";
  };

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Change Password</h1>
        <div className="mb-5 text-gray-500 text-sm">Hello {mbr?.nickname}</div>
        <div className="mb-5 text-gray-500 text-sm">Reset your password</div>
        <form action={resetPassword}>
          <LabelInput
            label="new password"
            type="password"
            name="passwd"
            focus={true}
            placeholder="New Password..."
          />
          <LabelInput
            label="new passwd confirm"
            type="password"
            name="passwd2"
            focus={true}
            placeholder="New Password..."
          />
          <Button type="submit" variant={"destructive"} className="mt-5 w-full">
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}
