import { PrismaClient } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

export default prisma;

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
      image: true,
      emailcheck: true,
      outdt: true,
      passwd,
    },
    where: { email },
  });

export type Member = Awaited<ReturnType<typeof findMemberById>>;
export type MemberWithCount = Awaited<
  ReturnType<typeof findMemberByIdWithCount>
>;

export const findMemberById = async (id: string | number) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      image: true,
      isadmin: true,
      email: true,
    },
    where: {
      id: Number(id),
    },
  });
``;
export const findMemberByIdWithCount = async (id: string | number) => {
  const sql = await prisma.member.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      nickname: true,
      image: true,
      isadmin: true,
      email: true,
      _count: { select: { Book: true, Mark: true } },
    },
  });

  console.log("sql", sql);

  return sql;
};
