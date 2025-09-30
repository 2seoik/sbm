import { CheckLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type FormEvent, useRef, useState, useTransition } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { passwdChange } from "./my.actions";

export default function PasswordChanger() {
  const router = useRouter();
  const { update } = useSession();

  const formRef = useRef<HTMLFormElement>(null);
  const [validError, setValidError] = useState<ValidError>();
  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // console.log(Object.fromEntries(formData.entries()));

    startTransition(async () => {
      // server
      const [err, mbr] = await passwdChange(formData);
      if (err) {
        setValidError(err);
      }

      await update(mbr);
      // router.refresh(); // 안쓰는 것이 좋음.
      router.replace("/my");
    });
  };

  return (
    <div className="rounded-md border-2 border-blue-300 p-2">
      <form onSubmit={submitHandler} ref={formRef}>
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
