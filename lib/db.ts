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
