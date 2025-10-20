"use server";

import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate } from "@/lib/validator";

export const createMark = async (formData: FormData) => {
  const session = await auth(); // use(auth());
  if (!session?.user || !session.user.email)
    throw new Error("로그인이 필요합니다.");

  const { id: mbrId } = session.user;

  const zobj = z.object({
    title: z.string().min(1),
    link: z.url(),
    id: z.string(),
  });

  const [err, data] = validate(zobj, formData);
  console.log("🚀 ~ book.action.ts ~ err:", err);
  if (err) return err;

  const { id, title, link } = data;
  await prisma.mark.create({
    data: {
      book: Number(id),
      title,
      link,
      maker: Number(mbrId),
      descript: "",
      image: "",
    },
  });
};
