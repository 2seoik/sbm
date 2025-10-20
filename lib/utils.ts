import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

export { default as DummyBookMark } from "@/public/bookmark_dummy.png";
export { default as DummyProfiie } from "@/public/profile_dummy.png";
export const DummyProfiieFile = "/public/profile_dummy.png";

export const newToken = () => uuid();

export const uniqNumId = (cnt = 5) =>
  Math.random()
    .toString(10)
    .substring(2, cnt + 2);

export const uniqId = (cnt = 5) =>
  Math.random()
    .toString(36)
    .substring(2, cnt + 2);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DynamicCsses = [
  "translate-x-[-20px]",
  "translate-x-[-40px]",
  "translate-x-[-60px]",
  "translate-x-[-80px]",
  "translate-x-[-100px]",
];
