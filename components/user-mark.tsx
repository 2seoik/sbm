import Image from "next/image";
import type { Mark } from "@/lib/generated/prisma";
import { cn, DummyBookMark } from "@/lib/utils";

export default function UserMark({ marks }: { marks: Mark[] }) {
  return (
    <div
      className={cn(
        { "overflow-y-scroll": 0 },
        "max-h-full space-y-2 overflow-y-scroll rounded-md p-1"
      )}
    >
      {marks.map((mark) => {
        const { id, title, image, descript } = mark;
        return (
          <div
            key={id}
            className="flex w-full items-center gap-2 rounded-lg border bg-white p-2 shadow-sm"
          >
            <div className="flex-shrink-0">
              <Image
                src={image || DummyBookMark}
                alt={title || "title..."}
                width={60}
                height={60}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-md">{title}</h3>
              <p className="text-gray-600 text-sm">{descript}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
