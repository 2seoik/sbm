import Link from "next/link";
import { use } from "react";

type Props = {
  searchParams: Promise<{ error: string; email?: string }>;
};

const getMessage = (err: string) => {
  if (err === "InvalidEmailCheck") return "Invalid Email....";
  if (err === "CheckEmail") return "Email Check Please...";
};

export default function AuthError({ searchParams }: Props) {
  const { error, email } = use(searchParams);

  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <h1 className="mb-5 font-semibold text-2xl">Sign Error Occured</h1>
        <div className="mb-5 text-red-500">{getMessage(error)}</div>

        <div className="">
          <Link href={`/sign?email=${email}`} className="w-full">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
