"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { newToken } from "@/lib/utils";
import { type FailureValid, validate } from "@/lib/validator";
import { sendRegistCheck } from "./mail.actions";

type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async () => login("naver");

export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // TODO : 작업끝나고 '/' 로 변경
};
export const authorize = async (
  _pre: FailureValid | undefined, //
  formData: FormData
) => {
  const zobj = z.object({
    email: z.email("잘못된 이메일 형식입니다."),
    passwd: z.string().min(6, "패스워드는 6자리 이상입니다.!"),
  });

  const result = validate(zobj, formData);
  if (!result.successed) return result;

  try {
    await signIn("credentials", { ...result.data, redirectTo: "/bookace/" });
    // await signIn("credentials", formData);
  } catch (error) {
    console.log("sign.action.authorize Error ---->", error);
    throw error;
  }
};

export const regist = async (
  _pre: FailureValid | undefined,
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

  const result = validate(zobj, formData);
  if (!result.successed) return result;

  const { email, nickname, passwd: orgPasswd } = result.data;
  const mbr = await findMemberByEmail(email);

  if (!mbr)
    return {
      successed: false,
      error: {
        email: { errors: ["Duplicated Email Address!"], value: email },
      },
    } as FailureValid;

  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();

  await prisma.member.create({
    data: { email, nickname, passwd, emailcheck },
  });

  await sendRegistCheck(email, emailcheck);

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

export const findMemberByEmail = async (
  email: string,
  passwd: boolean = false
) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      isadmin: true,
      emailcheck: true,
      passwd,
    },
    where: { email },
  });
