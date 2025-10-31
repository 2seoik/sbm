"only server";

import { PrismaClient } from "@/lib/generated/prisma/client";

const newInstance = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: for too many connections problems
declare const globalThis: {
  prismaGlobal: ReturnType<typeof newInstance>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? newInstance();

export default prisma;
globalThis.prismaGlobal = prisma;

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

export const findMemberByIdWithCount = async (id: string | number) => {
  return await prisma.member.findUnique({
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
};

// Book
export type BookAllColumn = Awaited<ReturnType<typeof findBookWithMarkById>>;
export type BookData = Omit<
  NonNullable<BookAllColumn>,
  "Mark" | "FollowBook" | "createdAt" | "updatedAt"
>;

export const findBookId = async (id: number) =>
  prisma.book.findUnique({
    where: {
      id,
    },
  });

export const findBookWithMarkById = async (id: number) =>
  prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      FollowBook: { select: { member: true } },
      Mark: {
        include: {
          // _count: { select: { Likes: true, Report: true, Talk: true } },
          Likes: { select: { member: true } },
          Report: { select: { member: true } },
          Talk: true,
        },
      },
    },
  });

// 이렇게도 사용하지만 좋지는 않음.
//   export const findBookWithMarkById = async (
//   id: number,
//   includeMark: boolean = true
// ) =>
//   prisma.book.findUnique({
//     where: {
//       id,
//     },
//     include: { Mark: includeMark },
//   });

// mark
export type MarkAllColumn = NonNullable<
  Awaited<ReturnType<typeof findMarkWithCount>>
>;
export type MarkData = Omit<MarkAllColumn, "_count" | "createAt" | "updateAt">;

export const findMarkWithCount = async (id: number) =>
  prisma.mark.findUnique({
    where: { id },
    include: {
      // _count: { select: { Likes: true, Talk: true, Report: true } },
      Likes: { select: { member: true } },
      Report: { select: { member: true } },
      Talk: true,
    },
  });
