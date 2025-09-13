"use client";
import Link from "next/link";
import { useActionState, useReducer } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { authorize, regist } from "./sign.action";

export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, false);
  return (
    <>
      {isSignin ? (
        <SignIn toggleSign={toggleSign} />
      ) : (
        <SignUp toggleSign={toggleSign} />
      )}
    </>
  );
}

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const [validError, makeLogin, isPending] = useActionState(
    authorize,
    undefined
  );

  return (
    <>
      <form action={makeLogin} className="flex flex-col space-y-2">
        <LabelInput
          label="email"
          name="email"
          type="email"
          error={validError}
          defaultValue={"jeonseongho@naver.com"}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          name="passwd"
          type="password"
          error={validError}
          defaultValue={"11111111"}
          placeholder="Your Password"
        />
        <div className="flex justify-between">
          <label htmlFor="remember" className="cursor-pointer">
            <input
              type="checkbox"
              id="remember"
              defaultChecked={true}
              className="mr-1 translate-y-[1px]"
            />
            Remember me
          </label>
          <Link href="/forgotpasswd">Forgot Password?</Link>
        </div>
        <Button
          type="submit"
          variant={"primary"}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "dd" : "Sign In"}
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Don&apos;t have account?</span>
        <Link href="#" onClick={toggleSign}>
          Sign Up
        </Link>
      </div>
    </>
  );
}

function SignUp({ toggleSign }: { toggleSign: () => void }) {
  const [validError, makeRegist, isPending] = useActionState(regist, undefined);

  return (
    <>
      <form action={makeRegist} className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          error={validError}
          // defaultValue={"email@bookmark.com"}
          focus={true}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          error={validError}
          placeholder="Your Password..."
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          error={validError}
          placeholder="Your Password..."
        />
        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          error={validError}
          placeholder="Your NickName..."
        />
        <Button
          type="submit"
          variant={"primary"}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Process..." : "Sign Up"}
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Already have account</span>
        <Link href="#" onClick={toggleSign}>
          Sign In
        </Link>
      </div>
    </>
  );
}
