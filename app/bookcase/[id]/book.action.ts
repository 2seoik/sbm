"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";

export const getAllBooksByMember = async (member: number) =>
  unstable_cache(
    async () => {
      // console.log("******* getAllBooksByMember>>", member);
      return prisma.book.findMany({
        where: { member },
        include: {
          FollowBook: { select: { member: true } },
          Mark: {
            include: {
              Likes: { select: { member: true } },
              Report: { select: { member: true } },
              Talk: true,
              Member: { select: { id: true, image: true, nickname: true } },
            },
          },
        },
      });
    },
    [`member-books-${member}`], // ! cache-key
    { tags: [`member-books-${member}`] }, // options
  )();

export const saveBook = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  const member = Number(session.user.id);

  // console.log("🚀 ~ formData:", Object.fromEntries(formData.entries()));

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
    await prisma.book.create({
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
        member,
      },
    });
  }

  revalidateTag(`member-books-${member}`);
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

  revalidateTag(`member-books-${Number(userId)}`);
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

export const deleteMarkWithBookId = async (markId: number, bookId: number) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) throw new Error("존재하지 않는 Book 입니다.");

  return deleteMark(markId, book.member);
};

export const deleteMark = async (id: number, bookOwner?: number) => {
  const { id: userId, isadmin } = await checkLogin();

  // check exists
  const mark = await prisma.mark.findUnique({
    where: { id },
  });
  if (!mark) throw new Error("존재하지 않는 Mark 입니다.");

  if (!bookOwner)
    if (!isadmin && Number(userId) !== bookOwner && mark.maker !== Number(userId))
      throw new Error("삭제 권한이 없습니다.");

  // if (!mark)
  //   throw new Error(
  //     isadmin ? "존재하지 않는 Mark입니다." : "삭제 권한이 없습니다."
  //   );

  await prisma.mark.delete({
    where: { id },
  });

  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleLikesOrReportMark = async (mark: number, type: "likes" | "reports", bookOwner: number) => {
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
  const likesCnt = await (isLikes ? prisma.likes.count(where) : prisma.report.count(where));

  if (likesCnt > 0) {
    type === "likes" ? await prisma.likes.delete(whereMarkMember) : await prisma.report.delete(whereMarkMember);
  } else {
    type === "likes"
      ? await prisma.likes.create({
          data,
        })
      : await prisma.report.create({
          data,
        });
  }

  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleFollowBook = async (book: number, bookOwner: number) => {
  const { id } = await checkLogin();
  const member = Number(id);
  const fb = await prisma.followBook.findUnique({
    where: { book_member: { book, member } },
  });

  if (fb)
    await prisma.followBook.delete({
      where: { book_member: { book, member } },
    });
  else
    await prisma.followBook.create({
      data: { book, member },
    });

  revalidateTag(`member-books-${bookOwner}`);
  // revalidatePath(`/bookcase/${bookOwner}`);
};

export const saveMark = async (formData: FormData) => {
  const { id: userId, isadmin } = await checkLogin();
  const maker = Number(userId);
  console.log("🚀 saveMark - formData:", Object.fromEntries(formData.entries()));

  const bookId = Number(formData.get("book"));
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });
  // if (!book) return { book: { errors: ["This book is not exists!"], value: bookId } };

  const zobj = z
    .object({
      link: z.string().min(1).max(1024),
      title: z.string().min(1).max(120),
      image: z.string().optional(),
      descript: z.string().optional(),
    })
    .refine(() => !!book, {
      path: ["book"],
      message: `${book} : Book 이 존재하지 않습니다.`,
    });

  const [err, data] = validate(zobj, formData);

  // * `!book?.id` is for TS
  if (err || !book?.id) {
    console.log("🚀 saveMar - err:", err, data);
    return err;
  }

  const id = Number(formData.get("id"));
  console.log("🚀 formData.mark.id:", id);
  const isBookOwner = book.member === maker;

  if (id) {
    await prisma.mark.update({
      where: isadmin || isBookOwner ? { id } : { id, maker },
      data,
    });
  } else {
    await prisma.mark.create({
      data: {
        ...data,
        book: book.id,
        maker,
      },
    });
  }

  revalidateTag(`member-books-${maker}`);
};
