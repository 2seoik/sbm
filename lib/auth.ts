import NextAuth, { AuthError, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import z from "zod";
import prisma from "./db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google,
    GitHub,
    Kakao,
    Naver,
    Credentials({
      // 최초 로그인시 입력받을 내용(sign -> page.tsx)
      credentials: {
        email: {},
        passwd: {},
      },
      async authorize(credentials) {
        console.log("credentials --->", credentials);
        const { email, passwd } = credentials;

        // 유효성 검사
        const validator = z
          .object({
            email: z.email("잘못된 이메일 형식입니다."),
            passwd: z.string().min(6, "패스워드는 6자리 이상입니다."),
          })
          .safeParse({ email, passwd });

        if (!validator.success) {
          // console.log("🚀 ~ validator.error:", validator.error);
          throw new AuthError(validator.error.message);
        }

        return { email, passwd } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const isCredential = account?.provider === "credentials";

      // console.log("🚀 ~ signIn user:", user);
      // console.log("🚀 ~ signIn profile:", profile);
      // console.log("🚀 ~ signIn account:", account);
      console.log("🚀 ~ signIn isCredential:", isCredential);

      const { email, name: nickname, image } = user;
      if (!email) return false;

      const mbr = await prisma.member.findUnique({ where: { email } });
      console.log("🚀 ~ mbr:", mbr);

      if (isCredential) {
        if (!mbr) throw new AuthError("NotExistMember");
        console.log("===========pass===========");
        // TODO : 암호비교(compare) ==> 실패시 오류!
        // 성공하면 로그인
      } else {
        // SNS 자동가입
        if (!mbr && nickname) {
          await prisma.member.create({
            data: { email, nickname, image },
          });
        }
      }
      return true;
    },
    // jwt 방식, GET /api/auth/callback/google에는 user없음!
    async jwt({ token, user, trigger, account, session }) {
      // console.log("🚀 ~ account:", account);

      // token 갱신 "signIn" | "signUp" | "update"
      // update 일때만 session
      const userData = trigger === "update" ? session : user;
      console.log("🚀 ~ userData:", userData);

      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true, // CORS
  jwt: { maxAge: 30 * 60 },
  pages: {
    signIn: "/sign",
    error: "/sign/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET as string,
});
