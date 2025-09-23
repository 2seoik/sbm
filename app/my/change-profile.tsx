"use client";

import { CheckLineIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChageProfile({ user }: Props) {
  const { update } = useSession({ required: true });
  const [diffEmail, setDiffEmail] = useState(false);

  return (
    <form action="" className="space-y-3 text-left">
      <LabelInput
        name="nickname"
        label="nickname"
        focus={true}
        defaultValue={user.name || ""}
      />
      <div className="mb-7 flex items-end gap-2">
        <LabelInput
          name="email"
          label="email"
          defaultValue={user.email || ""}
          onChange={(e) => setDiffEmail(e.target.value !== user.email)}
          className="w-full"
        />
        {diffEmail && <Button variant={"success"}>ddd</Button>}
      </div>
      <LabelInput
        name="curr_passwd"
        type="password"
        label="Current Password"
        placeholder="Current Password..."
      />
      <LabelInput
        name="new_passwd"
        type="password"
        label="New Password"
        placeholder="New Password..."
      />
      <LabelInput
        name="passwd2"
        type="password"
        label="New Password Confirm"
        placeholder="Current Password..."
      />
      <div className="flex justify-center gap-5">
        <Button variant={"outline"}>Cancel</Button>
        <Button variant={"primary"}>
          <CheckLineIcon></CheckLineIcon>
        </Button>
      </div>
    </form>
  );
}
