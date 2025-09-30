"use client";

import { CheckLineIcon, Undo2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import LabelEdit from "@/components/label-edit";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { updateNickName } from "../sign/sign.action";
import EmailChanger from "./email-changer";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChageProfile({ user }: Props) {
  // const { update } = useSession({ required: true }); // 로그인필수 (클라이언트) revalidate, refresh 사용함... 유의해서 사용
  const router = useRouter();
  const { update } = useSession();
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, true); // TODO : false

  const changeNickName = async (formData: FormData) => {
    const ent = Object.fromEntries(formData.entries());
    console.log("🚀 ~ change-profile.tsx ~ ent:", ent);
    const [err, mbr] = await updateNickName(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // 안쓰는 것이 좋음.
  };

  return (
    <div className="space-y-3 text-left">
      <LabelEdit
        name="nickname"
        label="nickname"
        defaultValue={user.name || ""}
        saveAction={changeNickName}
      />

      {isEditingEmail ? (
        <EmailChanger email={user.email} toggleEditing={toggleEditingEmail} />
      ) : (
        <Button
          onClick={toggleEditingEmail}
          variant={"success"}
          className="mt-3"
        >
          Change {user.email}
        </Button>
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
        placeholder="New Current Password..."
      />
      <div className="flex justify-center gap-5">
        <Button type="reset" variant={"outline"}>
          <Undo2Icon /> Cancel
        </Button>
        <Button type="submit" variant={"primary"}>
          <CheckLineIcon /> Save
        </Button>
      </div>
    </div>
  );
}
