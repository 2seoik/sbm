"use client";

import { Edit3Icon, PencilIcon, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import LabelEdit from "@/components/label-edit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [isEditingPassword, toggleEditingPassword] = useReducer((pre) => !pre, false); // TODO : false

  const changeNickName = async (formData: FormData) => {
    const ent = Object.fromEntries(formData.entries());
    console.log("🚀 ~ change-profile.tsx ~ ent:", ent);
    const [err, mbr] = await updateNickName(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // 안쓰는 것이 좋음.
  };

  return (
    <>
      <div className="glass rounded-xl p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <Edit3Icon className="h-5 w-5 text-primary" />
          프로필 정보
        </h3>
        <div className="space-y-4">
          <LabelEdit
            label="닉네임"
            name="nickname"
            defaultValue={user.name || ""}
            saveAction={changeNickName}
            inputClassName="w-full"
          />
          <div className={cn({ "w-full": !isEditingEmail })}>
            {isEditingEmail ? (
              <EmailChanger email={user.email} toggleEditing={toggleEditingEmail} />
            ) : (
              <Button onClick={toggleEditingEmail} variant={"hero"} className="mt-3 h-12 w-full">
                <PencilIcon /> 이메일 변경
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <SettingsIcon className="h-5 w-5 text-primary" />
          비밀번호 변경
        </h3>
        <div className="space-y-4">
          <div className={cn({ "w-full": !isEditingPassword })}>
            {isEditingPassword ? (
              <PasswordChanger toggleEditing={toggleEditingPassword} />
            ) : (
              <Button onClick={toggleEditingPassword} variant={"hero"} className="mt-3 h-12 w-full">
                <PencilIcon />
                비밀번호 변경
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
