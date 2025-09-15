import Link from "next/link";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswd() {
  const sendResetPassword = async () => {
    "use server";
  };
  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Forgot Password</h1>
        <div className="mb-5 text-gray-500 text-sm">
          Enter your email address when joined, and send to instructions to
          reset password.
        </div>
        <form action={sendResetPassword}>
          <LabelInput
            label="email"
            name="email"
            focus={true}
            placeholder="email@bookmark.com"
          />
          <Button type="submit" variant={"success"} className="mt-5 w-full">
            Send Instructions Email
          </Button>
        </form>
        <div className="mt-5 text-center">
          Back To <Link href="/sign">SignIn</Link>
        </div>
      </div>
    </div>
  );
}
