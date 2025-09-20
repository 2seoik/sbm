"use client";

import { useActionState } from "react";
import LabelInput from "@/components/label-input";
import { LoadingIcon } from "@/components/loading-icon";
import { Button } from "@/components/ui/button";
import { resetPassword } from "../sign/sign.action";

type Props = {
  email: string;
  emailcheck: string;
};
export default function ResetPassword({ email, emailcheck }: Props) {
  const [validError, formAction, isPending] = useActionState(
    resetPassword,
    undefined
  );

  const change = (formData: FormData) => {
    formData.set("email", email);
    formData.set("emailcheck", emailcheck);
    formAction(formData);
  };

  return (
    <form action={change}>
      <LabelInput
        label="new password"
        type="password"
        name="passwd"
        error={validError}
        focus={true}
        placeholder="New Password..."
      />
      <LabelInput
        label="new passwd confirm"
        type="password"
        name="passwd2"
        error={validError}
        placeholder="New Password..."
      />
      <Button
        type="submit"
        variant={"destructive"}
        className="mt-5 w-full"
        disabled={isPending}
      >
        <LoadingIcon isPending={isPending} text={"Change password"} />
      </Button>
    </form>
  );
}
