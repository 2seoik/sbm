"use client";
import Link from "next/link";
import { useReducer } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";

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

function SignUp({ toggleSign }: { toggleSign: () => void }) {
  return (
    <>
      <form action="#" className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="pwd"
          placeholder="Your Password..."
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="pwd2"
          placeholder="Your Password..."
        />
        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          placeholder="Your NickName..."
        />
        <Button type="submit" variant={"primary"} className="w-full">
          Sign Up
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

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  return (
    <>
      <form action="" className="flex flex-col space-y-2">
        <LabelInput
          label="email"
          name="email"
          type="email"
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          name="name"
          type="password"
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
          <Link href="#">Forgot Password?</Link>
        </div>
        <Button type="submit" variant={"primary"} className="w-full">
          Sign In
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
