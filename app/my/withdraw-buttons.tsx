"use client";

import { AlertCircleIcon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { withdraw } from "../sign/sign.action";

export default function WithDrawButton() {
  const [isPending, startTransition] = useTransition();
  const makeWithDraw = () => {
    startTransition(async () => {
      await withdraw();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon /> 탈퇴
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircleIcon />
            정말로 탈퇴하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-semibold">
            당신의 데이터는 삭제됩니다.......
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={makeWithDraw}
            className="bg-red-600 hover:bg-red-800"
            disabled={isPending}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
