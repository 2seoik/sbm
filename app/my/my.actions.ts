"use server";

import { hash } from "bcryptjs";
import z from "zod";
import { auth } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { comparePassword, validateAsync } from "@/lib/validator";

export const passwdChange = async (formdata: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email } = session.user;
  const mbr = await findMemberByEmail(email, true);
  // TODO : SNS 로그인의 경우 비밀번호가 존재하지 않는데,
  // 비밀번호 변경이 가능?

  const zobj = z
    .object({
      curr_passwd: z.string().min(6, "현재 비밀번호를 입력하세요."),
      passwd: z.string().min(6, "비밀번호는 6자리 이상입니다."),
      passwd2: z.string().min(6, "비밀번호는 6자리 이상입니다."),
    })
    .superRefine(async (val, ctx) => {
      if (mbr?.passwd) {
        const validPasswd = await comparePassword(val.curr_passwd, mbr.passwd);
        if (!validPasswd)
          ctx.addIssue({
            code: "custom",
            message: "현재 비밀번호가 일치하지 않습니다.",
            path: ["curr_passwd"],
          });
      }

      if (val.passwd !== val.passwd2) {
        ctx.addIssue({
          code: "custom",
          message: "새 비밀번호가 일치하지 않습니다.",
          path: ["passwd2"],
        });
      }
    });

  const [err, data] = await validateAsync(zobj, formdata);
  console.log("🚀 ~ my.actions.ts ~ err:", err);
  if (err) return [err, null] as const;

  const { passwd: newPasswd } = data;
  // 비밀번호 업데이트
  const passwd = await hash(newPasswd, 10);
  const updMbr = await prisma.member.update({
    where: { email },
    data: {
      passwd,
    },
  });

  return [null, updMbr] as const;
};

export const passwdChange2 = async (formdata: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { email } = session.user;
  const mbr = await findMemberByEmail(email, true);
  // TODO : SNS 로그인의 경우 비밀번호가 존재하지 않는데,
  // 비밀번호 변경이 가능?

  const zobj = z
    .object({
      curr_passwd: z.string().min(6, "현재 비밀번호를 입력하세요."),
      passwd: z.string().min(6, "비밀번호는 6자리 이상입니다."),
      passwd2: z.string().min(6, "비밀번호는 6자리 이상입니다."),
    })
    .superRefine(async (val, ctx) => {
      if (mbr?.passwd) {
        const validPasswd = await comparePassword(val.curr_passwd, mbr.passwd);
        if (!validPasswd)
          ctx.addIssue({
            code: "custom",
            message: "현재 비밀번호가 일치하지 않습니다.",
            path: ["curr_passwd"],
          });
      }

      if (val.passwd !== val.passwd2) {
        ctx.addIssue({
          code: "custom",
          message: "새 비밀번호가 일치하지 않습니다.",
          path: ["passwd2"],
        });
      }
    });

  const [err, data] = await validateAsync(zobj, formdata);
  console.log("🚀 ~ my.actions.ts ~ err:", err);
  if (err) return [err, null] as const;

  const { passwd: newPasswd } = data;
  // 비밀번호 업데이트
  const passwd = await hash(newPasswd, 10);
  const updMbr = await prisma.member.update({
    where: { email },
    data: {
      passwd,
    },
  });

  return [null, updMbr] as const;
};
