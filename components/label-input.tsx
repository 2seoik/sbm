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
  error?: ValidError;
  placeholder?: string;
  className?: string;
  focus?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
};
export default function LabelInput({
  label,
  type,
  name,
  error,
  placeholder,
  focus,
  className,
  ref,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqueName = useId();
  const inpRef = useRef<HTMLInputElement>(null);
  const err = !!error && !!name && error[name] ? error[name].errors : [];

  useEffect(() => {
    if (!focus && !err.length) return;
    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [focus, ref, err]);

  return (
    <label htmlFor={uniqueName} className="font-semibold text-sm capitalize">
      {label}
      <Input
        type={type || "text"}
        id={uniqueName}
        name={name || uniqueName}
        ref={ref || inpRef}
        placeholder={placeholder || ""}
        className={cn("bg-gray-100 font-normal focus:bg-white", className)}
        {...props}
      />
      {err.map((e) => (
        <span key={e} className="font-medium text-red-500">
          {e}
        </span>
      ))}
    </label>
  );
}
