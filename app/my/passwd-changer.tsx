"use client";
import { CheckLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { passwdChange2 } from "./my.actions";

export default function PasswordChanger() {
  const router = useRouter();
  const { update } = useSession();

  const [validError, formAction, isPending] = useActionState(
    async (_prev: ValidError | undefined, formData: FormData) => {
      const [err, mbr] = await passwdChange2(formData);
      if (err) return err;
      await update(mbr);
      router.refresh();
    },
    undefined
  );

  return (
    <div className="rounded-md border-2 border-blue-300 p-2">
      <form action={formAction}>
        <LabelInput
          label="Current Password"
          type="password"
          name="curr_passwd"
          error={validError}
          placeholder="현재 비밀번호"
        />
        <LabelInput
          label="New Password"
          type="password"
          name="passwd"
          error={validError}
          placeholder="새 비밀번호"
        />
        <LabelInput
          label="New Password Confirm"
          type="password"
          name="passwd2"
          error={validError}
          placeholder="비밀번호 다시입력"
        />
        <div className="mt-3 flex justify-end gap-5">
          <Button type="submit" variant={"primary"} disabled={isPending}>
            <CheckLineIcon /> 비밀번호 변경
          </Button>
        </div>
      </form>
    </div>
  );
}
