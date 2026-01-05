"use client";

import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import LabelEdit from "@/components/label-edit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateNickName } from "../sign/sign.action";
import EmailChanger from "./email-changer";
import PasswordChanger from "./password-changer";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChageProfile({ user }: Props) {
  // const { update } = useSession({ required: true }); // 로그인필수 (클라이언트) revalidate, refresh 사용함... 유의해서 사용
  const router = useRouter();
  const { update } = useSession();
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, false); // TODO : false
  const [isEditingPassword, toggleEditingPassword] = useReducer(
    (pre) => !pre,
    false
  ); // TODO : false

  const changeNickName = async (formData: FormData) => {
    const ent = Object.fromEntries(formData.entries());
    console.log("🚀 ~ change-profile.tsx ~ ent:", ent);
    const [err, mbr] = await updateNickName(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // 안쓰는 것이 좋음.
  };

  return (
    <div className="flex flex-col gap-5 text-left">
      <div className="w-[80%]">
        <LabelEdit
          name="nickname"
          label="nickname"
          defaultValue={user.name || ""}
          saveAction={changeNickName}
          inputClassName="w-full"
        />
      </div>
      <div className={cn({ "w-[80%]": !isEditingEmail })}>
        {isEditingEmail ? (
          <EmailChanger email={user.email} toggleEditing={toggleEditingEmail} />
        ) : (
          <Button
            onClick={toggleEditingEmail}
            variant={"success"}
            className="mt-3 h-12 w-full"
          >
            <PencilIcon /> 이메일 변경 {user.email}
          </Button>
        )}
      </div>
      <div className={cn({ "w-[80%]": !isEditingPassword })}>
        {isEditingPassword ? (
          <PasswordChanger toggleEditing={toggleEditingPassword} />
        ) : (
          <Button
            onClick={toggleEditingPassword}
            variant={"destructive"}
            className="mt-3 h-12 w-full"
          >
            <PencilIcon />
            비밀번호 변경
          </Button>
        )}
      </div>
    </div>
  );
}
