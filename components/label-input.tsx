"use client";
import { type ComponentProps, type RefObject, useId } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  ref?: RefObject<HTMLInputElement | null>;
};
export default function LabelInput({
  label,
  type,
  name,
  placeholder,
  className,
  ref,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqueName = useId();

  return (
    <label htmlFor={uniqueName} className="font-semibold text-sm capitalize">
      {label}
      <Input
        type={type || "text"}
        id={uniqueName}
        name={name || uniqueName}
        ref={ref}
        placeholder={placeholder || ""}
        className={cn("bg-gray-100 font-normal focus:bg-white", className)}
        {...props}
      />
    </label>
  );
}
