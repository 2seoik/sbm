"use client";

import { useRouter } from "next/navigation";
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
    <div>
      <h2 className="text-2xl">Something went wrong!</h2>
      {process.env.NODE_ENV === "development" ? (
        <pre className="font-sm text-red-500">
          {error.stack || error.message}
        </pre>
      ) : (
        <div className="font-sm text-red-500">{error.message}</div>
      )}
      <pre style={{ color: "red" }}>{error.stack || error.message}</pre>
      <Button onClick={() => reset()}>Try again</Button>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );
}
