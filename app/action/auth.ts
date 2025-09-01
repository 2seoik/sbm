"use server";

import { signOut } from "next-auth/react";

export const signOutWithForm = async () => {
  await signOut();
};
