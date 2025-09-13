import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";

export default async function ResetForgotPasswd({
  params,
}: Promise<{ emailcheck: true }>) {
  const { emailcheck } = await params;
  const mbr = "";
  //   const mbr = await prisma.member.findFirst({
  //     select: { nickname: true, emailcheck: true, email: true },
  //     where: { emailcheck },
  //   });

  //   if (!mbr) {
  //     return <h1>Error</h1>;
  //   }

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
            type="password"
            label="passwd"
            name="passwd"
            placeholder="New Password..."
            focus={true}
          />
          <LabelInput
            type="password"
            label="new passwd confirm"
            name="passwd2"
            placeholder="New Password..."
            focus={true}
          />
          <Button type="submit" variant={"destructive"} className="mt-5 w-full">
            change password
          </Button>
        </form>
      </div>
    </div>
  );
}
