"use client";

import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef, useState } from "react";
import LabelInput from "@/components/label-input";
import { LoadingIcon } from "@/components/loading-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authorize, regist } from "./sign.action";

export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, true);

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold font-heading text-2xl sm:text-3xl">
          {isSignin ? "다시 만나서 반갑습니다" : "SBM에 오신 것을 환영합니다"}
        </h1>
        <p className="text-muted-foreground">
          {isSignin ? "계정에 로그인하여 북마크를 관리하세요" : "계정을 만들고 북마크를 공유해보세요"}
        </p>
      </div>
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
  email === null ? localStorage.removeItem("SBM_LOCAL_EMAIL") : localStorage.setItem("SBM_LOCAL_EMAIL", email);
};

// 로그인
function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirectTo = searchParams.get("redirectTo");

  const passwdRef = useRef<HTMLInputElement>(null);
  const rememberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [validError, makeLogin, isPending] = useActionState(authorize, undefined);

  const remeberMe = () => {
    if (rememberRef.current?.checked && emailRef.current?.value) storeEmail(emailRef.current.value);
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
      <form action={makeLoginAction} className="space-y-6">
        {/* {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )} */}
        {/* Email Field */}
        <LabelInput
          label="이메일"
          name="email"
          type="email"
          error={validError}
          ref={emailRef}
          focus={true}
          defaultValue={email || ""}
          // defaultValue={"jeonseongho@naver.com"}
          placeholder="email@example.com"
          icon={MailIcon}
        />

        {/* Password Field */}
        <div className="relative">
          <div className="absolute top-0 right-0">
            <Link href="/forgotpasswd" className="text-primary text-sm transition-colors hover:text-primary/80">
              비밀번호 찾기
            </Link>
          </div>
          <LabelInput
            label="비밀번호"
            name="passwd"
            type="password"
            error={validError}
            ref={passwdRef}
            // defaultValue={"11111111"}
            placeholder="Your Password"
            icon={LockIcon}
          />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isPending}>
          <LoadingIcon isPending={isPending}>로그인</LoadingIcon>
        </Button>
        {/* <div className="flex justify-between">
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
        </div> */}
      </form>
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

// 회원가입
function SignUp({ toggleSign }: { toggleSign: () => void }) {
  const [validError, makeRegist, isPending] = useActionState(regist, undefined);
  const [showPasswd, setShowPasswd] = useState(false);

  return (
    <>
      <form action={makeRegist} className="flex flex-col space-y-3">
        {/* Email Field */}
        <LabelInput
          label="이메일"
          type="email"
          name="email"
          error={validError}
          defaultValue={dummy.email}
          placeholder="email@bookmark.com"
          icon={MailIcon}
        />

        {/* Nick Name Field */}
        <LabelInput
          label="닉네임"
          type="text"
          name="nickname"
          error={validError}
          defaultValue={dummy.nickname}
          placeholder="Your NickName..."
          icon={UserIcon}
        />

        {/* Password Field */}
        <LabelInput
          label="비밀번호"
          type="password"
          name="passwd"
          error={validError}
          defaultValue={dummy.passwd}
          placeholder="Your Password..."
          icon={LockIcon}
        />

        {/* Confirm Password Field */}
        <div className="relative">
          <LabelInput
            label="비밀번호 확인"
            type={showPasswd ? "text" : "password"}
            name="passwd2"
            error={validError}
            defaultValue={dummy.passwd2}
            placeholder="Your Password..."
            icon={LockIcon}
          />
          {/* <button
            type="button"
            onClick={() => setShowPasswd(!showPasswd)}
            className="-translate-y-1/2 absolute top-12 right-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPasswd ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button> */}
        </div>

        <Button type="submit" variant="hero" className="w-full" disabled={isPending}>
          <LoadingIcon isPending={isPending}>회원가입</LoadingIcon>
        </Button>
      </form>
      {/* <div className="mt-5 flex gap-10">
        <span>Already have account</span>
        <Link href="#" onClick={toggleSign}>
          Sign In
        </Link>
      </div> */}
    </>
  );
}
