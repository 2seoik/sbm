"use client";
import Link from "next/link";
import { useActionState, useReducer } from "react";
import z from "zod";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { authorize } from "./sign.action";

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
  const makeLogin = async (formData: FormData) => {
    // const email = formData.get("email");
    // const passwd = formData.get("passwd");

    // const validator = z
    //   .object({
    //     email: z.email("잘못된 이메일 형식입니다."),
    //     passwd: z.string().min(6),
    //   })
    //   .safeParse(Object.fromEntries(formData.entries()));

    // if (!validator.success) {
    //   console.log("🚀 ~ validator.error:", validator.error);
    //   return alert(validator.error);
    // }

    const res = await authorize(formData);
    console.log("🚀 ~ res sign form -----------> ", res);
  };

  return (
    <>
      <form action={makeLogin} className="flex flex-col space-y-2">
        <LabelInput
          label="email"
          name="email"
          type="email"
          defaultValue={"jeonseongho@naver.com"}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          name="passwd"
          type="password"
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

function SignUp({ toggleSign }: { toggleSign: () => void }) {
  const [validError, makeRegist, isPending] = useActionState(
    async (_pre: ValidError | undefined, formData: FormData) => {
      const zobj = z
        .object({
          email: z.email(),
          passwd: z.string().min(6),
          passwd2: z.string().min(6),
          nickname: z.string().min(3),
        })
        .refine(
          ({ passwd, passwd2 }) => passwd === passwd2,
          "비밀번호가 일치하지 않습니다."
        )
        .safeParse(Object.fromEntries(formData.entries()));

      if (!zobj.success) {
        const err = z.treeifyError(zobj.error).properties;
        return err;
      }
    },
    undefined
  );
  return (
    <>
      <form action={makeRegist} className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          error={validError}
          focus={true}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          error={validError}
          focus={true}
          placeholder="Your Password..."
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          error={validError}
          focus={true}
          placeholder="Your Password..."
        />
        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          error={validError}
          focus={true}
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
