"use client";
import Link from "next/link";
import { useActionState } from "react";
import LabelInput from "@/components/label-input";
import { LoadingIcon } from "@/components/loading-icon";
import { Button } from "@/components/ui/button";
import { sendResetPassword } from "../sign/sign.action";

export default function ForgotPasswd() {
  // const sendResetPassword = async () => {
  //   "use server";
  // };

  const [validError, sendMail, isPending] = useActionState(
    sendResetPassword,
    undefined
  );

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Forgot Password</h1>
        <div className="mb-5 text-gray-500 text-sm">
          Enter your email address when joined, and send to instructions to
          reset password.
        </div>
        <form action={sendMail}>
          <LabelInput
            label="email"
            name="email"
            focus={true}
            error={validError}
            placeholder="email@bookmark.com"
          />
          <Button
            type="submit"
            variant={"success"}
            className="mt-5 w-full"
            disabled={isPending}
          >
            <LoadingIcon
              isPending={isPending}
              text={"Send Instructions Email"}
            />
          </Button>
        </form>
        <div className="mt-5 text-center">
          Back To <Link href="/sign">SignIn</Link>
        </div>
      </div>
    </div>
  );
}
