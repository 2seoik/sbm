import { CheckLineIcon, Undo2Icon } from "lucide-react";
import { type ActionDispatch, useActionState } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { updatePassword } from "../sign/sign.action";

type Props = {
  toggleEditing: ActionDispatch<[]>;
};

export default function PasswordChanger({ toggleEditing }: Props) {
  const [validError, changePasswrd, isPending] = useActionState((_prev: ValidError | undefined, formData: FormData) => {
    const err = updatePassword(formData);

    if (err) return err;
    toggleEditing();
  }, undefined);

  //   const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.currentTarget);
  //     console.log("🚀 ~ ent:", Object.fromEntries(formData.entries()));
  //     changePasswrd(formData);
  //   };

  //   const formAction = (formData: FormData) => {
  //     changePasswrd(formData);
  //   };

  return (
    <form
    // action={formAction}
    // onSubmit={(e) => startTransition(() => submitHandler(e))}
    // onSubmit={submitHandler}
    >
      <div className="space-y-4">
        <LabelInput
          label="현재 비밀번호"
          type="password"
          name="curr_passwd"
          placeholder="Current Password..."
          error={validError}
        />
        <LabelInput
          label="새 비밀번호"
          type="password"
          name="passwd"
          placeholder="New Password..."
          error={validError}
        />
        <LabelInput
          label="새 비밀번호 확인"
          type="password"
          name="passwd2"
          placeholder="New Current Password..."
          error={validError}
        />
        <div className="mt-4 flex justify-center gap-5">
          <Button type="reset" variant={"outline"} onClick={toggleEditing}>
            <Undo2Icon /> 취소
          </Button>
          <Button formAction={changePasswrd} type="submit" variant={"hero"} disabled={isPending}>
            <CheckLineIcon /> 확인
          </Button>
        </div>
      </div>
    </form>
  );
}
