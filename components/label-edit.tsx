"use client";

import { CheckLineIcon, Undo2Icon } from "lucide-react";
import {
  type ComponentProps,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import type { LabelInputProps } from "./label-input";
import LabelInput from "./label-input";
import { Button } from "./ui/button";

type Props = {
  saveAction: (formData: FormData) => Promise<ValidError | undefined>;
};

export default function LabelEdit({
  saveAction,
  label,
  type,
  name,
  error,
  focus,
  defaultValue,
  placeholder,
  className,
  inputClassName,
  ref,
  ...props
}: ComponentProps<"input"> & LabelInputProps & Props) {
  const [isDirty, setDirty] = useState(false);
  const [validError, setValidError] = useState<ValidError>();
  const labelRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  //   const [validError, submitActon, isPending] = useActionState(
  //     async (_: ValidError | undefined, formData: FormData) => {
  //       const err = await saveAction(formData);
  //       if (err) return error;
  //       setDirty(false);
  //     },
  //     undefined
  //   );

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const err = await saveAction(formData);
      if (err) {
        setValidError(error);
      } else setDirty(false);
    });
  };

  //   const resetHandler = () => {
  //     const inputRef = ref || labelRef;
  //     console.log("🚀 ~ label-edit.tsx ~ inputRef.current:", inputRef.current);
  //     if (inputRef.current) {
  //       setDirty(defaultValue !== inputRef.current.value);
  //     }
  //   };

  return (
    <form
      onSubmit={submitHandler}
      onResetCapture={() => setDirty(false)}
      className="flex gap-3"
    >
      <LabelInput
        label={label}
        type={type}
        name={name}
        ref={ref || labelRef}
        focus={focus}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(className, "w-full")}
        inputClassName={inputClassName}
        error={error || validError}
        onKeyUp={(e) => {
          //   console.log(">>>>", e, e.currentTarget.value);
          setDirty(defaultValue !== e.currentTarget.value);
        }}
        {...props}
      />
      {isDirty && (
        <div className="flex items-end gap-2">
          <Button type="reset" variant={"outline"}>
            <Undo2Icon />
          </Button>
          <Button type="submit" variant={"primary"} disabled={isPending}>
            <CheckLineIcon />
          </Button>
        </div>
      )}
    </form>
  );
}
