"use client";

import { CheckLineIcon, Undo2Icon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useActionState, useReducer, useState } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { sendEmailChangeCode } from "../sign/sign.action";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChageProfile({ user }: Props) {
  // const { update } = useSession({ required: true }); // 로그인필수 (클라이언트) revalidate, refresh 사용함... 유의해서 사용
  const { update } = useSession();
  const [diffEmail, setDiffEmail] = useState(false);
  const [didSendCode, toggleSendCode] = useReducer((pre) => !pre, false);

  const [emailError, sendEmailCode, isEmailPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      const err = await sendEmailChangeCode(formData);
      if (err) return err;
      toggleSendCode();
      // await update(mbr);
    },
    undefined
  );
  return (
    <form action="" className="space-y-3 text-left">
      <LabelInput
        name="nickname"
        label="nickname"
        error={emailError}
        defaultValue={user.name || ""}
      />
      <div
        className={cn(
          {
            "mt-5": didSendCode,
            "mb-7": !didSendCode,
          },
          "flex items-end gap-2"
        )}
      >
        <LabelInput
          name="newEmail"
          label="email"
          error={emailError}
          defaultValue={user.email || ""}
          onChange={(e) => setDiffEmail(e.target.value !== user.email)}
          className="w-full"
        />
        {diffEmail && (
          <Button
            formAction={sendEmailCode}
            variant={"success"}
            disabled={isEmailPending}
          >
            {didSendCode ? "Resend" : "Send"} Verify Code
          </Button>
        )}
      </div>
      {didSendCode && (
        <div className="mb-7 flex items-end gap-3">
          <LabelInput
            label="Email Cahnge Code (2분)"
            type="text"
            name="emailChangeCode"
            placeholder="인증번호"
          />
          <Button
            formAction={sendEmailCode}
            variant={"success"}
            disabled={isEmailPending}
          >
            인증메일
          </Button>
        </div>
      )}
      <LabelInput
        label="Current Password"
        type="password"
        name="curr_passwd"
        placeholder="Current Password..."
      />
      <LabelInput
        label="New Password"
        type="password"
        name="passwd"
        placeholder="New Password..."
      />
      <LabelInput
        label="New Password Confirm"
        type="password"
        name="passwd2"
        placeholder="Current Password..."
      />
      <div className="flex justify-center gap-5">
        <Button variant={"outline"}>
          <Undo2Icon />
          Cancel
        </Button>
        <Button variant={"primary"}>
          <CheckLineIcon />
          Save
        </Button>
      </div>
    </form>
  );
}
