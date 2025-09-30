import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  type ActionDispatch,
  type FormEvent,
  type MouseEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { flushSync } from "react-dom";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { sendEmailChangeCode, updateEmail } from "../sign/sign.action";

type Props = {
  email: string | null | undefined;
  toggleEditing: ActionDispatch<[]>;
};

export default function EmailChanger({ email, toggleEditing }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [diffEmail, setDiffEmail] = useState(false);
  const [didSendCode, toggleSendCode] = useReducer((pre) => !pre, false);
  const [validError, setValidError] = useState<ValidError>();

  const formRef = useRef<HTMLFormElement>(null);
  const emailCodeRef = useRef<HTMLInputElement>(null);

  const [submitType, setSubmitType] = useState<"sendmail" | "confirm">(
    "sendmail"
  );

  const [isSending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    console.log(">>>>>> submitType >>>>>>>", submitType);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (emailCodeRef.current)
      formData.set("emailChangeCode", emailCodeRef.current?.value);

    console.log("🚀 ~ ent:", Object.fromEntries(formData.entries()));

    startTransition(async () => {
      if (submitType === "sendmail") {
        const err = await sendEmailChangeCode(formData);
        if (err) {
          setValidError(err);
        } else {
          setValidError(undefined);
          toggleSendCode();
        }
      } else if (submitType === "confirm") {
        const [err, mbr] = await updateEmail(formData);

        if (err) {
          setValidError(err);
        } else {
          await update(mbr);
          router.refresh();
        }
      }
    });
  };

  const sendmail = (e: MouseEvent) => {
    e.preventDefault();
    setSubmitType(() => "sendmail");
    // ?
    formRef.current?.requestSubmit();
  };

  const confirmAndSave = (e: MouseEvent) => {
    e.preventDefault();
    flushSync(() => setSubmitType("confirm"));
    // ?
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (didSendCode && emailCodeRef.current) emailCodeRef.current.focus();
  }, [didSendCode]);

  return (
    <div
      className={cn(
        { "mt-5": didSendCode, "mb-7": !didSendCode },
        "rounded-md border-2 border-green-300 p-2"
      )}
    >
      <form onSubmit={submitHandler} ref={formRef} className="flex gap-2">
        <LabelInput
          label="email"
          name="newEmail"
          className="w-full"
          defaultValue={email || ""}
          error={validError}
          onChange={(e) => setDiffEmail(e.target.value !== email)}
        />
        {diffEmail && (
          <div
            className={cn(
              {
                "items-center": !didSendCode && !!validError,
                "items-end": !didSendCode && !validError,
              },
              "flex"
            )}
          >
            <Button onClick={sendmail} variant={"success"} disabled={isSending}>
              {didSendCode ? "Resend" : "Send"} Verify Code
            </Button>
          </div>
        )}
      </form>
      {didSendCode && (
        <div className="flex items-center gap-3">
          <LabelInput
            label="Email Cahnge Code (2분)"
            type="text"
            name="emailChangeCode"
            placeholder="input Ccde..."
            ref={emailCodeRef}
            error={validError}
          />
          <Button
            onClick={confirmAndSave}
            variant={"primary"}
            disabled={isSending}
          >
            Confirm Code & Save
          </Button>
        </div>
      )}
    </div>
  );
}
