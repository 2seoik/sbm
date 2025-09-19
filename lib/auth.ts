import { compare } from "bcryptjs";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import z from "zod";
import { findMemberByEmail } from "@/app/sign/sign.action";
import prisma from "./db";
import { validateObject } from "./validator";

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

        // 유효성 검사
        const zobj = z.object({
          email: z.email("잘못된 이메일 형식입니다."),
          passwd: z.string().min(6, "패스워드는 6자리 이상입니다."),
        });

        const [err, data] = validateObject(zobj, credentials);
        if (err) return err;

        return data;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      // console.log("🚀 ~ user:", user);
      // console.log("🚀 ~ profile:", profile);
      // console.log("🚀 ~ account:", account);

      const isCredential = account?.provider === "credentials";

      const { email, name: nickname, image } = user;
      if (!email) return false;

      console.log("🚀 ~ isCredential:", isCredential);
      const mbr = await findMemberByEmail(email, isCredential);
      //prisma.member.findUnique({ where: { email } });
      console.log("🚀 ~ 회원정보 ==========>", mbr);

      if (mbr?.emailcheck) {
        // 왜안되는지 확인할것..
        // return redirect(`/sign/error?error=CheckEmail&email=${email}`);

        // TODO : 이메일 승인 받지 않은상태에서 로그인 했을경우 이메일체크 다시 보내기
        return `/sign/error?error=CheckEmail&email=${email}&emailcheck=${mbr.emailcheck}`;
      }

      // 이메일, 비밀번호 가입
      if (isCredential) {
        if (!mbr)
          throw authError("존재하지 않는 회원입니다.", "EmailSignInError");
        if (mbr.outdt) throw authError("탈퇴한 회원입니다.", "AccessDenied");
        if (!mbr.passwd)
          throw authError(
            "SNS로 가입한 회원입니다. SNS 로그인을 진행해주세요.",
            "OAuthAccountNotLinked"
          );

        const isValiedPasswd = await compare(user.passwd ?? "", mbr.passwd);
        if (!isValiedPasswd)
          throw authError("비밀번호가 일치하지 않습니다.", "EmailSignInError");
      }
      // SNS 자동 가입
      else {
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
        token.image = userData.image;
        token.isadmin = userData.isadmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isadmin = token.isadmin;
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

function authError(message: string, type: AuthError["type"]) {
  console.log("🚀 ~ message ------> ", message);
  const authError = new AuthError(message);
  authError.type = type as typeof authError.type; //"EmailSignInError";
  return authError;
}
