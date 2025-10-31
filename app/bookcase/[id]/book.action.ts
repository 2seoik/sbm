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
      message: "Book이 공개된 경우 열람 및 삭제기능을 활성화 할 수 없습니다.",
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

export const likesAndReports = async (member: number) => {
  // 메모리 DB로 구성할수있음. cf.redis
  const ilikes = await prisma.likes.findMany({
    where: { member },
    select: { mark: true },
  });

  const ireports = await prisma.report.findMany({
    where: { member },
    select: { mark: true },
  });

  return [ilikes, ireports];
};

const checkLogin = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");
  return session.user;
};

export const deleteMark = async (id: number, bookOwner: number) => {
  const { id: userId, isadmin } = await checkLogin();

  // check exists
  const mark = await prisma.mark.findUnique({
    where: { id },
  });
  if (!mark) throw new Error("존재하지 않는 Mark 입니다.");

  if (!isadmin && Number(userId) !== bookOwner && mark.maker !== Number(userId))
    throw new Error("삭제 권한이 없습니다.");

  // if (!mark)
  //   throw new Error(
  //     isadmin ? "존재하지 않는 Mark입니다." : "삭제 권한이 없습니다."
  //   );

  await prisma.mark.delete({
    where: { id },
  });
};

export const toggleLikesOrReportMark = async (
  mark: number,
  type: "likes" | "reports"
) => {
  // error 체크를 위함
  const { id: userId } = await checkLogin();
  const member = Number(userId);

  const isLikes = type === "likes";

  // typescript 에서는 2개를 같은 모델로 상속받을수 없기 때문에 사용할수 없음...
  // 런타임때 알수있기때문
  // const model = isLikes ? prisma.likes : prisma.report;

  const data = { mark, member };
  const where = { where: data };
  const whereMarkMember = { where: { mark_member: data } };

  // error 테스트
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("XXXXXXXXXX");

  // drezzle?
  // select Member from likes where mark = mark and member = memeber;
  // const likes = await prisma.likes.findMany({
  //   where: { mark },
  //   select: { member: true },
  // });

  // select count(*) from likes ....
  //  await (type === "likes" ....
  const likesCnt = await (isLikes
    ? prisma.likes.count(where)
    : prisma.report.count(where));

  if (likesCnt > 0) {
    return type === "likes"
      ? prisma.likes.delete(whereMarkMember)
      : prisma.report.delete(whereMarkMember);
  } else {
    return type === "likes"
      ? prisma.likes.create({
          data,
        })
      : prisma.report.create({
          data,
        });
  }
};
