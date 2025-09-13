import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// export const newToken = () => {

// };

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
