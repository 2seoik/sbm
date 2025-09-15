/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect Dependency-array */
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
  focus?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  ref?: RefObject<HTMLInputElement | null>;
};
export default function LabelInput({
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
}: Props & ComponentProps<"input">) {
  const uniqueName = useId();
  const inpRef = useRef<HTMLInputElement>(null);
  const err = !!error && !!name && error[name] ? error[name].errors : [];
  const val =
    !!error && !!name && error[name] ? error[name].value?.toString() : "";

  useEffect(() => {
    if (!focus && !err.length) return;

    const keys = Object.keys(error ?? {});
    if (!focus && (!err.length || keys[0] !== name)) return;

    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [err]);

  return (
    <div className={cn(className)}>
      <label htmlFor={uniqueName} className="font-semibold text-sm capitalize">
        {label}
        <Input
          type={type || "text"}
          id={uniqueName}
          name={name || uniqueName}
          ref={ref || inpRef}
          placeholder={placeholder || ""}
          defaultValue={val || defaultValue}
          className={cn(
            "bg-gray-100 font-normal focus:bg-white",
            inputClassName
          )}
          {...props}
        />
        {err.map((e) => (
          <span key={e} className="font-medium text-red-500">
            {e}
          </span>
        ))}
      </label>
    </div>
  );
}
