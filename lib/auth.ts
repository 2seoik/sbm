import NextAuth, { AuthError } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import z from "zod";
import prisma, { findMemberByEmail } from "./db";
import { comparePassword, validateObject } from "./validator";

export const MAX_AGE = 30 * 60;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
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
        // console.log("credentials --->", credentials);

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
      console.log("🚀 ~ user:", user);
      console.log("🚀 ~ profile:", profile);
      console.log("🚀 ~ account:", account);

      const isCredential = account?.provider === "credentials";

      const { email, name: nickname, image } = user;
      if (!email) return false;

      let mbr = await findMemberByEmail(email, isCredential);
      //prisma.member.findUnique({ where: { email } });

      if (isCredential) {
        if (!mbr)
          throw authError("존재하지 않는 회원입니다.", "EmailSignInError");
        if (mbr.outdt) throw authError("탈퇴한 회원입니다.", "AccessDenied");
        if (!mbr.passwd)
          throw authError(
            "SNS로 가입한 회원입니다. SNS 로그인을 진행해주세요.",
            "OAuthAccountNotLinked"
          );

        const isValidPasswd = await comparePassword(user.passwd, mbr.passwd);
        if (!isValidPasswd)
          throw authError("비밀번호가 일치하지 않습니다!", "CredentialsSignin");

        // 이메일 승인 받지 않은상태에서 로그인 했을경우 이메일체크 다시 보내기
        if (mbr?.emailcheck)
          return `/sign/error?error=CheckEmail&email=${email}&emailcheck=${mbr.emailcheck}`;
      } else {
        if (!mbr) {
          mbr = await prisma.member.create({
            data: { email, nickname: nickname || "guest", image },
          });
        }
      }

      user.id = String(mbr.id);
      user.name = mbr.nickname;
      if (mbr.image) user.image = mbr.image;
      user.isadmin = mbr.isadmin;

      return true;
    },
    // jwt 방식, GET /api/auth/callback/google에는 user없음!
    async jwt({ token, user, trigger, session }) {
      // console.log("🚀 ~jwt session:", session);
      // console.log("🚀 ~jwt account:", account);
      // console.log("🚀 ~jwt trigger:", trigger);
      // console.log("🚀 ~jwt user:", user);
      // console.log("🚀 ~jwt token:", token);
      // console.log("🚀 ~ account:", account);

      // token 갱신 "signIn" | "signUp" | "update"
      // update 일때만 session
      const userData = trigger === "update" ? session : user;
      if (trigger === "update") {
        console.log("token EXP >>>>>>>>>>>>>>>>>> ", token.exp);
        // console.log("🚀 ~ auth.ts ~ userData:", userData);
      }
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
        token.image = userData.image;
        token.isadmin = userData.isadmin;

        // if (account) {
        //   console.log("🚀 ~ account ======>", token.accessToken);
        //   token.accessToken = account?.access_token; // <- id_token
        //   token.accessTokenExpires =
        //     Date.now() + (account.expires_in ?? 0) * 1000;
        //   token.refreshToken = account.refresh_token;
        // }
      }
      // const exp = Math.floor(Date.now() / 1000) + 10 * 60;
      // console.log(">>>>>>>>>>>>>>> EXP CHANGE:", exp);
      // token.exp = exp; // 브라우저는 초

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isadmin = token.isadmin;

        // if (token.exp) {
        //   const expireDate = new Date(token.exp * 1000);
        //   session.expires = expireDate; // 서버는 datetime

        //   const krDate = expireDate.toLocaleString("ko-KR", {
        //     timeZone: "Asia/Seoul",
        //   });

        //   // console.log(">>>>>>>>>>>>>>>>>> token.exp:", token.exp);
        //   // console.log(">>>>>>>>>>>>>>>>>> session.expires:", krDate);
        // }
      }
      return session;
    },
  },
  trustHost: true, // CORS
  jwt: {
    maxAge: MAX_AGE,
    async encode(params) {
      return encode(params);
    },
    async decode(params) {
      return decode(params);
    },
  },
  pages: {
    signIn: "/sign",
    error: "/sign/error",
  },
  session: {
    strategy: "jwt", // or 'database'
    maxAge: MAX_AGE, // default 1Month
  },
  secret: process.env.AUTH_SECRET as string,
});

function authError(message: string, type: AuthError["type"]) {
  console.log("🚀 ~ message ------> ", message);
  const authError = new AuthError(message);
  authError.type = type as typeof authError.type; //"EmailSignInError";
  return authError;
}
