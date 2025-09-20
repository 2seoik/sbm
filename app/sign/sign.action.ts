"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import z from "zod";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { newToken } from "@/lib/utils";
import { type ValidError, validate } from "@/lib/validator";
import type { SendMailBody } from "../api/sendmail/route";

export type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string | null) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async (redirectTo?: string | null) =>
  login("naver", redirectTo);

export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // TODO : 작업끝나고 '/' 로 변경
};

// 로그인
export const authorize = async (
  _pre: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z.object({
    email: z.email("잘못된 이메일 형식입니다."),
    passwd: z.string().min(6, "패스워드는 6자리 이상입니다."),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  try {
    const redirectTo = formData.get("redirectTo")?.toString() || "/bookcase";
    await signIn("credentials", { ...data, redirectTo });
    // await signIn("credentials", formData);
  } catch (error) {
    console.log("sign.action.authorize Error ---->", error);

    if (error instanceof AuthError) {
      let typeErr: string;
      switch (error.type) {
        case "AccessDenied":
        case "EmailSignInError": // email magic link
          typeErr = error.message.split("Read more")[0];
          break;
        case "OAuthAccountNotLinked":
          typeErr = `Already registed SNS Account`;
          break;
        case "CredentialsSignin":
          typeErr =
            error.message.split("Read more")[0] ||
            "Not match Email or Password!";
          break;
        default:
          typeErr = error.message || "Something went wrong!";
      }

      return {
        email: { errors: [typeErr], value: data?.email },
        passwd: { errors: [], value: data.passwd },
      } as ValidError;
    }
    throw error;
  }
};

// 회원가입
export const regist = async (
  _pre: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z
    .object({
      email: z.email("잘못된 이메일 형식입니다."),
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
      nickname: z.string().min(3),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      error: "비밀번호가 일치하지 않습니다.",
      path: ["passwd2"],
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, nickname, passwd: orgPasswd } = data;

  const mbr = await findMemberByEmail(email);
  if (mbr)
    return {
      email: { errors: ["이미 존재하는 이메일입니다."], value: email },
    } as ValidError;

  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();

  await prisma.member.create({
    data: { email, nickname, passwd, emailcheck },
  });

  // await sendRegistCheck(email, emailcheck);

  // Next의 fetch (edge 런타임에서 실행)
  sendMailByFetch({ email, emailcheck });

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

// 비밀번호 변경이메일 발송
export const sendResetPassword = async (
  _: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z.object({
    email: z.email("잘못된 이메일 형식입니다."),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email } = data;

  const mbr = await findMemberByEmail(email);
  if (!mbr)
    return {
      email: {
        errors: ["존재하지 않는 이메일입니다. 이메일을 확인 해주세요."],
        value: email,
      },
    };

  const emailcheck = newToken();
  const { nickname } = await prisma.member.update({
    select: { nickname: true },
    where: { email },
    data: {
      emailcheck,
    },
  });

  const rs = await sendMailByFetch({
    email,
    emailcheck,
    nickname,
    emailType: "resetPassword",
  });

  if (!rs.ok) return { email: { errors: ["이메일 발송을 실패했습니다."] } };
  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

// 인증 메일 다시 보내기
export const resendRegist = async (
  _: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z.object({
    email: z.email("잘못된 이메일 형식입니다."),
    emailcheck: z.uuidv4(),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, emailcheck } = data;
  const mbr = await findMemberByEmail(email);

  if (!mbr || mbr.emailcheck !== emailcheck) {
    redirect("/sign/error?error=EmailSendFail");
  }

  const newEmailCheck = newToken();
  await prisma.member.update({
    where: {
      email,
    },
    data: {
      emailcheck: newEmailCheck,
    },
  });

  const rs = await sendMailByFetch({
    email,
    emailcheck: newEmailCheck,
  });

  if (!rs.ok) return { email: { errors: ["이메일 발송을 실패했습니다."] } };

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

// 비밀번호 변경
export const resetPassword = async (
  _: ValidError | undefined,
  formData: FormData
) => {
  const zobj = z
    .object({
      email: z.email(), //
      emailcheck: z.uuidv4(), //
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["passwd2"],
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, emailcheck, passwd: newPasswd } = data;

  const mbr = await findMemberByEmail(email);

  if (!mbr)
    return {
      email: { errors: ["존재하지 않는 이메일입니다."], values: email },
    };

  if (mbr.emailcheck !== emailcheck) {
    redirect("/sign/error?error=EmailSendFail");
  }

  const passwd = await hash(newPasswd, 10);
  await prisma.member.update({
    where: { email, emailcheck },
    data: {
      passwd,
      emailcheck: null,
    },
  });

  redirect(`/sign?email=${email}`);
};

// 이메일로 회원찾기
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
      outdt: true,
      passwd,
    },
    where: { email },
  });

// 메일 보내기
const sendMailByFetch = async ({
  email,
  emailcheck,
  nickname,
  emailType = "regist",
}: SendMailBody) => {
  const { NEXT_PUBLIC_URL, INTERNAL_SECRET } = process.env;

  return fetch(`${NEXT_PUBLIC_URL}/api/sendmail`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${INTERNAL_SECRET}`,
    },
    body: JSON.stringify({ email, emailcheck, nickname, emailType }),
  });
};
