/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect Dependency-array */
"use client";
import type { Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { type ComponentProps, cloneElement, type JSX, type RefObject, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { Input } from "./ui/input";

export type LabelInputProps = {
  label: string;
  type?: string;
  name?: string;
  error?: ValidError;
  focus?: boolean;
  defaultValue?: string | number | null;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  ref?: RefObject<HTMLInputElement | null>;
  icon?: LucideIcon;
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
  icon: Icon,
  ...props
}: LabelInputProps & ComponentProps<"input">) {
  const uniqueName = useId();
  const inpRef = useRef<HTMLInputElement>(null);
  const err = !!error && !!name && error[name] ? error[name].errors : [];
  const val = !!error && !!name && error[name] ? error[name].value?.toString() : "";

  useEffect(() => {
    if (!focus && !err.length) return;

    const keys = Object.keys(error ?? {});
    if (!focus && (!err.length || keys[0] !== name)) return;

    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [err]);

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={uniqueName} className="font-semibold text-sm capitalize">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
        )}
        <Input
          type={type || "text"}
          id={uniqueName}
          name={name || uniqueName}
          ref={ref || inpRef}
          placeholder={placeholder || ""}
          defaultValue={val || defaultValue || ""}
          className={cn(
            "h-12 border-border/50 bg-secondary/50 focus:border-primary",
            Icon ? "pl-10" : "",
            inputClassName,
          )}
          {...props}
        />
      </div>
      {err.map((e) => (
        <p key={e} className="text-destructive text-sm">
          {e}
        </p>
      ))}
    </div>
  );
}
