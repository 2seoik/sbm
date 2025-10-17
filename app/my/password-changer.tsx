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
  const [validError, changePasswrd, isPending] = useActionState(
    (_prev: ValidError | undefined, formData: FormData) => {
      const err = updatePassword(formData);

      if (err) return err;
      toggleEditing();
    },
    undefined
  );

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
      className="rounded-md border-2 border-red-300 p-3"
      // action={formAction}
      // onSubmit={(e) => startTransition(() => submitHandler(e))}
      // onSubmit={submitHandler}
    >
      <LabelInput
        label="Current Password"
        type="password"
        name="curr_passwd"
        placeholder="Current Password..."
        error={validError}
      />
      <LabelInput
        label="New Password"
        type="password"
        name="passwd"
        placeholder="New Password..."
        error={validError}
      />
      <LabelInput
        label="New Password Confirm"
        type="password"
        name="passwd2"
        placeholder="New Current Password..."
        error={validError}
      />
      <div className="mt-4 flex justify-center gap-5">
        <Button type="reset" variant={"outline"} onClick={toggleEditing}>
          <Undo2Icon /> 취소
        </Button>
        <Button
          formAction={changePasswrd}
          type="submit"
          variant={"primary"}
          disabled={isPending}
        >
          <CheckLineIcon /> 확인
        </Button>
      </div>
    </form>
  );
}
