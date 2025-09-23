"use client";

import { useRouter } from "next/navigation";
import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  //   useEffect(() => {}, [error]);

  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl">Something went wrong!</h2>
        <div className="item-center flex flex-col gap-3">
          <div className="h-64 w-96 overflow-y-auto">
            {process.env.NODE_ENV === "development" ? (
              <pre className="font-sm text-red-500">
                {error.stack || error.message}
              </pre>
            ) : (
              <div className="font-sm text-red-500">{error.message}</div>
            )}
            <pre style={{ color: "red" }}>{error.stack || error.message}</pre>
          </div>
          <Button onClick={() => reset()}>Try again</Button>
          <Divider label="or" />
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    </div>
  );
}
