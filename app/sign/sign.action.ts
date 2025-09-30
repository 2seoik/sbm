"use server";

import { hash } from "bcryptjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import path from "path";
import z from "zod";
import { auth, signIn, signOut } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { newToken, uniqId, uniqNumId } from "@/lib/utils";
import {
  comparePassword,
  existsEmail,
  type ValidError,
  validate,
} from "@/lib/validator";
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

// credential 로그인
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

// credential 회원가입
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

  const existsErr = existsEmail(email);
  if (existsErr) return existsErr;

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
  _pre: ValidError | undefined,
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

  // 비밀번호 찾기 이메일발송을 여러번 할수있는경우가 생길수있음.
  if (mbr.emailcheck) {
    return {
      email: {
        errors: ["이미 인증메일이 발송되었습니다. 이메일을 확인 해주세요."],
        value: email,
      },
    };
  }

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

  // if (!mbr)
  //   return {
  //     passwd: { errors: ["존재하지 않는 이메일입니다."] },
  //   };

  if (!mbr || mbr.emailcheck !== emailcheck) {
    redirect("/sign/error?error=InvalidEmailCheck");
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

export type UpdateProfileImageReturn = ReturnType<typeof updateProfileImage>;

export const updateProfileImage = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email, id } = session.user;

  const zobj = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "Under 10MB!")
      .refine((file) => file.type.startsWith("image/"), "Upload Image only!"),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err];

  // os 별 path 관리
  const uploadDir = path.join(process.cwd(), "public", "profiles");
  // uploadDir이 존재하지 않는다면 생성
  if (!existsSync(uploadDir)) mkdirSync(uploadDir);

  // const file = formData.get("image") as File;
  const fileName = `${id}_${uniqId()}${data.image.name}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await data.image.arrayBuffer());
  await writeFile(filePath, buffer);
  const image = `/profiles/${fileName}`;

  const mbr = await prisma.member.update({
    where: { email },
    data: { image },
  });

  revalidatePath("/profiles");

  return [null, mbr];
};

export type updateMemberReturnType = ReturnType<typeof updateNickName>;

export const updateNickName = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email } = session.user;
  const zobj = z.object({
    nickname: z.string().min(4),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err, null] as const;

  const { nickname } = data;
  const mbr = await prisma.member.update({
    where: { email },
    data: { nickname },
  });

  return [null, mbr] as const;
};

export const sendEmailChangeCode_일괄저장 = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email } = session.user;
  const mbr = await findMemberByEmail(email);

  const zobj = z.object({
    nickname: z.string().min(3),
    newEmail: z.email(),
    curr_passwd: z.string().optional(),
    passwd: z.string().optional(),
    passwd2: z.string().optional(),
  });
  // .refine(
  //   ({ curr_passwd, passwd, passwd2 }) => {
  //     return (
  //       (!curr_passwd && !passwd && !passwd2) ||
  //       (curr_passwd && passwd && passwd2)
  //     );
  //   },
  //   { path: ["passwd2"], message: "Input the all password to change!" }
  // )
  // .refine(({ curr_passwd, passwd, passwd2 }) => {
  //   if (curr_passwd && passwd && passwd2 && mbr?.passwd) {
  //     return passwd === passwd2;
  //   }
  //   return true;
  // });

  const [err, data] = validate(zobj, formData);
  console.log("🚀 ~ sign.action.ts ~ err:", err);
  if (err) return err;

  const dataErr: ValidError = {};
  for (const [key, value] of Object.entries(data)) {
    dataErr[key] = { errors: [], value };
  }

  const { newEmail, nickname, curr_passwd } = data;

  if (mbr?.passwd && curr_passwd) {
    const validCurrPasswd = await comparePassword(mbr?.passwd, curr_passwd);
    if (validCurrPasswd) {
      return {
        ...dataErr,
        curr_passwd: { errors: ["비밀번호가 맞지않음"], value: curr_passwd },
      };
    }
  }

  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return { ...dataErr, ...existsErr };

  const emailcheck = uniqNumId();
  await prisma.member.update({
    where: {
      email,
    },
    data: {
      emailcheck,
    },
  });

  setTimeout(async () => {
    await prisma.member.update({
      where: {
        email,
      },
      data: {
        emailcheck: null,
      },
    });
  }, 2 * 60 * 1000);

  await sendMailByFetch({
    email,
    emailcheck,
    nickname,
    emailType: "emailChangeCode",
  });

  return dataErr;
};

export const sendEmailChangeCode = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email, name } = session.user;
  const mbr = await findMemberByEmail(email);

  const zobj = z.object({
    newEmail: z.email(),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { newEmail } = data;
  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return existsErr;

  const emailcheck = uniqNumId();
  await prisma.member.update({
    where: {
      email,
    },
    data: {
      emailcheck,
    },
  });

  setTimeout(async () => {
    await prisma.member.update({
      where: {
        email,
      },
      data: {
        emailcheck: null,
      },
    });
  }, 2 * 60 * 1000);

  // TODO : 임시 주석
  // await sendMailByFetch({
  //   email,
  //   emailcheck,
  //   nickname: name || "",
  //   emailType: "emailChangeCode",
  // });
};

export const updateEmail = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  console.log("****>>", Object.fromEntries(formData.entries()));

  const { email } = session.user;
  const mbr = await findMemberByEmail(email);
  if (!mbr || !mbr.emailcheck || mbr.emailcheck.length !== 5) {
    return [
      {
        emailChangeCode: {
          errors: ["인증코드가 유효하지 않습니다."],
        },
      } as ValidError,
      null,
    ] as const;
  }

  const zobj = z.object({
    newEmail: z.email(),
    emailChangeCode: z.literal(mbr.emailcheck, "인증코드가 일치하지 않습니다."),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err, null] as const;

  const { newEmail } = data;
  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return [existsErr, null] as const;

  const newMbr = await prisma.member.update({
    where: {
      email: email,
    },
    data: {
      email: newEmail,
      emailcheck: null,
    },
  });
  console.log("🚀 ~ sign.action.ts ~ newMbr:", newMbr);

  return [null, newMbr] as const;
};
