"use server";

import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";

export const saveBook = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  const member = Number(session.user.id);

  console.log("🚀 ~ formData:", Object.fromEntries(formData.entries()));

  const zobj = z
    .object({
      title: z.string().min(1),
      ispublic: z.string().optional(),
      withdel: z.string().optional(),
      remark: z.string().optional(),
    })
    .refine(({ ispublic, withdel }) => !ispublic || (ispublic && !withdel), {
      path: ["withdel"],
      message: "퍼블릭일경우 삭제할 수 없습니다.",
    });

  const [err, data] = validate(zobj, formData);
  console.log("🚀 ~ book.action.ts ~ err:", err);
  if (err) return err;

  const id = Number(formData.get("id"));

  const { id: userId, isadmin } = session.user;

  if (id) {
    await prisma.book.update({
      where: isadmin
        ? { id }
        : {
            id,
            member: Number(userId),
          },
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
      },
    });
  } else {
    console.log(">>>>>> create book");
    await prisma.book.create({
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
        member,
      },
    });
  }
};

export const deleteBook = async (id: number) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  // check exists!
  const zobj = z
    .object({
      id: z.number(),
    })
    .superRefine(async ({ id }, ctx) => {
      const book = await prisma.book.findUnique({
        where: { id },
      });
      if (!book) {
        ctx.addIssue({
          code: "custom",
          message: `This Book(#${id}) is not exists`,
          path: ["id"],
        });
      }
    });

  const [err, data] = await validateAsync(zobj, { id });
  if (err) return err;

  const { id: userId, isadmin } = session.user;

  await prisma.book.delete({
    where: isadmin
      ? { id }
      : {
          id,
          member: Number(userId),
        },
  });
};
