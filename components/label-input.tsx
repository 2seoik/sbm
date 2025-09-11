"use client";

import {
  type ComponentProps,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  ref?: RefObject<HTMLInputElement | null>;
  focus?: boolean;
  error?: ValidError;
  placeholder?: string;
  className?: string;
};

export default function LabelInput({
  label,
  type,
  name,
  ref,
  focus,
  error,
  placeholder,
  className,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqName = useId();
  const inpRef = useRef<HTMLInputElement>(null);
  const err = !!error && !!name && error[name] ? error[name].errors : [];

  useEffect(() => {
    if (!focus && !err.length) return;
    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [focus, ref, err]);

  return (
    <label htmlFor={uniqName} className="font-semibold text-sm capitalize">
      {label}
      <Input
        type={type || "text"}
        id={uniqName}
        name={name || uniqName}
        ref={ref || inpRef}
        placeholder={placeholder || ""}
        className={cn("bg-gray-100 font-normal focus:bg-white", className)}
        {...props}
      />
      {err.map((e) => (
        <small key={e} className="ml-1 text-red-400">
          {e}
        </small>
      ))}
    </label>
  );
}
