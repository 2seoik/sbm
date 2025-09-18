"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { authorize, regist } from "./sign.action";

export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, true);
  return (
    <>
      {isSignin ? (
        // 로그인
        <SignIn toggleSign={toggleSign} />
      ) : (
        // 회원가입
        <SignUp toggleSign={toggleSign} />
      )}
    </>
  );
}

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirectTo = searchParams.get("redirectTo");

  const passwdRef = useRef<HTMLInputElement>(null);

  const [validError, makeLogin, isPending] = useActionState(
    authorize,
    undefined
  );

  const makeLoginAction = (formData: FormData) => {
    if (redirectTo) formData.set("redirectTo", redirectTo);
    makeLogin(formData);
  };

  useEffect(() => {
    if (email) {
      passwdRef.current?.focus();
    }
  }, [email]);

  return (
    <>
      <form action={makeLogin} className="flex flex-col space-y-2">
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}
        <LabelInput
          label="email"
          name="email"
          type="email"
          error={validError}
          focus={true}
          defaultValue={email || ""}
          // defaultValue={"jeonseongho@naver.com"}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          name="passwd"
          type="password"
          error={validError}
          ref={passwdRef}
          // defaultValue={"11111111"}
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

const dummy = {
  // email: "seoikk21@gmail.com",
  // passwd: "12121212",
  // passwd2: "12121212",
  // nickname: "",
  email: "",
  passwd: "",
  passwd2: "",
  nickname: "",
};

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
          defaultValue={dummy.email}
          focus={true}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          error={validError}
          defaultValue={dummy.nickname}
          placeholder="Your NickName..."
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          error={validError}
          defaultValue={dummy.passwd}
          placeholder="Your Password..."
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          error={validError}
          defaultValue={dummy.passwd2}
          placeholder="Your Password..."
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
