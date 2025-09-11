"use client";
import {
  type ComponentProps,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import type { ValidErrorObject } from "@/lib/validator";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  focus?: boolean;
  error?: ValidErrorObject;
  placeholder?: string;
  className?: string;
  ref?: RefObject<HTMLInputElement | null>;
};
export default function LabelInput({
  label,
  type,
  name,
  focus,
  error,
  placeholder,
  className,
  ref,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqueName = useId();
  // if (error?.prop) console.log(name, error.prop);
  const err =
    !!error?.prop && name && error.prop[name] ? error.prop[name].errors : [];
  const path = error?.path;
  const inpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focus || !err.length) return;
    if (ref) {
      ref.current?.focus();
    } else {
      // console.log("path", path, inpRef.current);
      if (inpRef.current?.name === path) inpRef.current?.focus();
    }
  }, [focus, err, ref, path]);

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
        <span key={e} className="ml-1 font-medium text-red-400">
          {e}
        </span>
      ))}
    </label>
  );
}
