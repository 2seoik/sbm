"use client";

import { type RefObject, useEffect, useId, useState } from "react";
import type { ValidError } from "@/lib/validator";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Props = {
  name?: string;
  label?: string;
  type?: "checkbox" | "switch";
  ref?: RefObject<HTMLButtonElement>;
  error?: ValidError;
  checkValue?: boolean;
  setCheckedFunction?: (checked: boolean) => void;
};

/**
 * @ usage <CheckSwitch type='switch' name='' label='xx' />
 */
export default function CheckSwitch({
  name,
  label,
  type = "checkbox",
  ref,
  error,
  checkValue,
  setCheckedFunction,
}: Props) {
  const uid = useId();

  const { errors, value } = !!error && !!name && error[name] ? error[name] : { errors: [] };
  const [checked, setChecked] = useState(checkValue || !!value);

  const Compo = type === "checkbox" ? Checkbox : Switch;

  // biome-ignore lint/correctness/useExhaustiveDependencies: value not change when 'on'
  useEffect(() => {
    if (value) setChecked(true);
  }, [error]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Compo
          id={uid}
          name={(type === "switch" && !!name ? name : null) || uid}
          ref={ref}
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(!!checked);
            if (setCheckedFunction) setCheckedFunction(!!checked);
          }}
        />
        <Label htmlFor={uid} className="cursor-pointer">
          {label}
        </Label>
        {type === "checkbox" && !!name && <Input type="hidden" name={name} value={checked ? "on" : ""} />}
      </div>
      <div className="flex flex-col">
        {errors?.map((e) => (
          <p key={e} className="mt-1 text-red-500 text-sm">
            {e}
          </p>
        ))}
      </div>
    </div>
  );
}
