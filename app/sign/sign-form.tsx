"use client";
import { LoaderPinwheelIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useReducer } from "react";
import z from "zod";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidErrorObject } from "@/lib/validator";
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
    async (
      _preValidError: ValidErrorObject | undefined,
      formData: FormData
    ) => {
      const validator = z
        .object({
          email: z.email(),
          passwd: z.string().min(1),
          passwd2: z.string().min(1),
          nickname: z.string().min(1),
        })
        .refine(({ passwd, passwd2 }) => passwd === passwd2, {
          error: "비밀번호가 일치하지 않습니다.",
          path: ["passwd2"],
        })
        .safeParse(Object.fromEntries(formData.entries()));

      if (!validator.success) {
        // const err1 = validator.error.flatten();
        const valid = validator.error;
        const tree = z.treeifyError(valid);

        // console.log("🚀 ~ validator:", valid.issues);
        // console.log("🚀 ~ tree:", tree);

        const errObject: ValidErrorObject = {
          prop: tree.properties,
          path: valid.issues[0].path[0] as string,
        };

        return errObject;
      }
    },
    undefined
  );

  // const makeRegist = async (formData: FormData) => {
  //   const validator = z
  //     .object({
  //       email: z.email(),
  //       passwd: z.string().min(6),
  //       passwd2: z.string().min(6),
  //       nickname: z.string().min(3),
  //     })
  //     .refine(
  //       ({ passwd, passwd2 }) => passwd === passwd2,
  //       "비밀번호가 일치하지 않습니다."
  //     )
  //     .safeParse(Object.fromEntries(formData.entries()));

  //   if (!validator.success) {
  //     // const err1 = validator.error.flatten();
  //     const err2 = z.treeifyError(validator.error).properties;
  //     console.log("🚀 ~ err2:", err2);
  //   }
  // };
  return (
    <>
      <form action={makeRegist} className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          focus={true}
          error={validError}
          // defaultValue={"jeonseongho@naver.com"}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          focus={true}
          error={validError}
          placeholder="Your Password..."
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          focus={true}
          error={validError}
          placeholder="Your Password..."
        />
        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          focus={true}
          error={validError}
          // defaultValue={"111"}
          placeholder="Your NickName..."
        />
        <Button
          type="submit"
          variant={"primary"}
          className="w-full"
          disabled={isPending}
        >
          {/* {isPending ? "Singing Up..." : "Sign Up"} */}
          {isPending && <LoaderPinwheelIcon className="animate-spin" />} Sign Up
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
