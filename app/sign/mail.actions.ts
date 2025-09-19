import { createTransport } from "nodemailer";

type Attachments = {
  filename: string;
  path: string;
}[];

const { google_user: user, google_app_password: pass } = process.env;

const TRANS = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user, pass },
});

const FROM = '"BookMark" <seoikk21@gmail.com>';

const sendMail = async (
  to: string, // 수신자
  subject: string, // 제목
  html: string, // 내용
  attachments?: Attachments // 첨부파일
) =>
  TRANS.sendMail({
    from: FROM,
    to,
    bcc: "bangka17@naver.com", // TODO : 참조
    subject,
    html,
    attachments,
  });

export const sendRegistCheck = async (to: string, authKey: string) => {
  const subject = "[BookMark] Regist Authentication Mail";
  const html = `
    <div style="display: grid; place-items: center; height: 200px;">
      <h1>Welcome to BookMark!</h1>
      <h3 style="margin: 10px 0;">
        Please click on the link below to complete your subscription
      </h3>
      <a href="${process.env.NEXT_PUBLIC_URL}/registcheck/${authKey}?email=${to}">가입 인증</a>
    </div>
  `;

  return sendMail(to, subject, html);
};

export const sendPasswordReset = async (
  to: string,
  authKey: string,
  nickname?: string
) => {
  const subject = "[Bookmark] Reset Password";
  const html = `
    <div style="display: grid; place-items: center; height: 200px;">
      <h1>Reset Password</h1>
      <h2>Hello, ${nickname}</h2>
      <h3 style="margin: 10px 0;">
        Click the link below to reset your password.
      </h3>
      <a href="${process.env.NEXT_PUBLIC_URL}/forgotpasswd/${authKey}">Reset Password</a>
    </div>
  `;

  return sendMail(to, subject, html);
};
