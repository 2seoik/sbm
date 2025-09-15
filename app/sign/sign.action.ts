"use server";

import z from "zod";
import { signIn, signOut } from "@/lib/auth";
import { type ValidError, validate } from "@/lib/validator";

type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async () => login("naver");

export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // TODO : 작업끝나고 '/' 로 변경
};

export const authorize = async (
  _pre: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z.object({
    email: z.email("잘못된 이메일 형식입니다."),
    passwd: z.string().min(6, "패스워드는 6자리 이상입니다."),
  });

  const [err] = validate(zobj, formData);
  if (err) return err;

  try {
    await signIn("credentials", formData);
  } catch (error) {
    console.log("sign action", error);
    throw error;
  }
};

export const regist = async (
  _pre: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z
    .object({
      email: z.email(),
      passwd: z.string().min(1),
      passwd2: z.string().min(1),
      nickname: z.string().min(1),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      error: "비밀번호가 일치하지 않습니다.",
      path: ["passwd2"],
    });

  const [err] = validate(zobj, formData);
  if (err) return err;
};
