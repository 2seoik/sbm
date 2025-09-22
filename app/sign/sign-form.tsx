"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef } from "react";
import LabelInput from "@/components/label-input";
import { LoadingIcon } from "@/components/loading-icon";
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

const readEmail = () => localStorage.getItem("SBM_LOCAL_EMAIL");

const storeEmail = (email: string | null) => {
  console.log(email);
  email === null
    ? localStorage.removeItem("SBM_LOCAL_EMAIL")
    : localStorage.setItem("SBM_LOCAL_EMAIL", email);
};

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirectTo = searchParams.get("redirectTo");

  const passwdRef = useRef<HTMLInputElement>(null);
  const rememberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [validError, makeLogin, isPending] = useActionState(
    authorize,
    undefined
  );

  const remeberMe = () => {
    if (rememberRef.current?.checked && emailRef.current?.value)
      storeEmail(emailRef.current.value);
    else storeEmail(null);
  };

  const makeLoginAction = (formData: FormData) => {
    remeberMe();

    if (redirectTo) formData.set("redirectTo", redirectTo);
    makeLogin(formData);
  };

  useEffect(() => {
    const storedEmail = readEmail();
    if (rememberRef.current) rememberRef.current.checked = !!storedEmail;
    if (emailRef.current && storedEmail) emailRef.current.value = storedEmail;

    if (email || storedEmail) passwdRef.current?.focus;
  }, [email]);

  return (
    <>
      {/* hidden 필드 넣고, makeLogin 함수 직접 호출하여도 무방, 하지만 hidden 값이 쉽게 노출될 우려가 있음. */}
      <form action={makeLoginAction} className="flex flex-col space-y-2">
        {/* {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )} */}
        <LabelInput
          label="email"
          name="email"
          type="email"
          error={validError}
          ref={emailRef}
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
              ref={rememberRef}
              onChange={remeberMe}
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
          <LoadingIcon isPending={isPending} text={"Sign In"} />
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
          <LoadingIcon isPending={isPending} text={"Sign Up"} />
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
