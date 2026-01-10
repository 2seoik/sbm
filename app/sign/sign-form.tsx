"use client";

import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef, useState } from "react";
import LabelInput from "@/components/label-input";
import { LoadingIcon } from "@/components/loading-icon";
import { Button } from "@/components/ui/button";
import { SocialLoginButton } from "./(sign-buttons)/social-login-button";
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
        <SignIn />
      ) : (
        // 회원가입
        <SignUp />
      )}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-border/50 border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted-foreground">또는</span>
        </div>
      </div>
      <div className="space-y-3">
        <SocialLoginButton provider="google" />
        <SocialLoginButton provider="github" />
        <div className="grid grid-cols-2 gap-3">
          <SocialLoginButton provider="naver" />
          <SocialLoginButton provider="kakao" />
        </div>
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        {isSignin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
        <Link
          href="#"
          onClick={toggleSign}
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          {" "}
          {isSignin ? "회원가입" : "로그인"}
        </Link>
      </p>
    </>
  );
}

const readEmail = () => localStorage.getItem("SBM_LOCAL_EMAIL");

const storeEmail = (email: string | null) => {
  console.log(email);
  email === null ? localStorage.removeItem("SBM_LOCAL_EMAIL") : localStorage.setItem("SBM_LOCAL_EMAIL", email);
};

// 로그인
function SignIn() {
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
    <form action={makeLoginAction} className="space-y-6">
      {/* hidden 필드 넣고, makeLogin 함수 직접 호출하여도 무방, 하지만 hidden 값이 쉽게 노출될 우려가 있음. */}
      {/* {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )} */}

      <LabelInput
        label="이메일"
        name="email"
        type="email"
        error={validError}
        ref={emailRef}
        focus={true}
        defaultValue={email || ""}
        // defaultValue={""}
        placeholder="email@example.com"
        icon={MailIcon}
      />

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
function SignUp() {
  const [validError, makeRegist, isPending] = useActionState(regist, undefined);
  const [showPasswd, setShowPasswd] = useState(false);

  return (
    <form action={makeRegist} className="flex flex-col space-y-3">
      <LabelInput
        label="이메일"
        type="email"
        name="email"
        focus={true}
        error={validError}
        defaultValue={dummy.email}
        placeholder="email@bookmark.com"
        icon={MailIcon}
      />
      <LabelInput
        label="닉네임"
        type="text"
        name="nickname"
        error={validError}
        defaultValue={dummy.nickname}
        placeholder="Your NickName..."
        icon={UserIcon}
      />
      <LabelInput
        label="비밀번호"
        type="password"
        name="passwd"
        error={validError}
        defaultValue={dummy.passwd}
        placeholder="Your Password..."
        icon={LockIcon}
      />
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
  );
}
