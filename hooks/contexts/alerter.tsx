"use client";

import {
  CircleAlertIcon,
  CircleQuestionMarkIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  createContext,
  type PropsWithChildren,
  use,
  useRef,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ContextValueProps = {
  confirm: (options: Options) => Promise<string>;
  alert: (options: Options | null, error?: unknown) => Promise<string>;
  prompt: (options: Options) => Promise<string>;
};

const AlerterContext = createContext<ContextValueProps>({
  confirm: () => new Promise((resolve) => resolve("")),
  alert: () => new Promise((resolve) => resolve("")),
  prompt: () => new Promise((resolve) => resolve("")),
});

type AlertType = "confirm" | "alert" | "prompt";
type Options = {
  title: string;
  desc?: string;
  type?: AlertType;
  okText?: string;
  cancelText?: string;
  placeholder?: string;
  variant?: "default" | "destructive";
};

export function AlerterProvider({ children }: PropsWithChildren) {
  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [resolver, setResolver] = useState<(value: string) => void>(() => {});
  const inputRef = useRef<HTMLInputElement>(null);

  // type     destructive             default
  // ------------------------------------------
  // confirm    Triagle             CircleAlert
  // alert      Octagon-X           CircleAlert
  // prompt     CircleQuestionMark  CircleQuestionMark
  const variantIcon = () => {
    if (options?.type === "prompt") return <CircleQuestionMarkIcon />;
    if (options?.variant === "destructive")
      return options?.type === "confirm" ? (
        <TriangleAlertIcon />
      ) : (
        <OctagonXIcon />
      );

    return <CircleAlertIcon />;
  };

  const setup = (options: Options, type: AlertType) => {
    return new Promise<string>((resolve) => {
      setOptions({ ...options, type });
      setResolver(() => resolve);
      setOpen(true);
    });
  };

  const makeResolver = (value: string) => {
    setTimeout(resolver, 100, value);
  };

  const confirm = (options: Options) => setup(options, "confirm");
  const alert = (options: Options | null, error?: unknown) => {
    return setup(
      options
        ? options
        : {
            title:
              error instanceof Error ? error.message : JSON.stringify(error),
          },
      "alert"
    );
  };

  const prompt = (options: Options) => setup(options, "prompt");

  return (
    <AlerterContext.Provider value={{ confirm, alert, prompt }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent className="w-80 translate-y-[-150px] sm:w-96">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn("flex items-center gap-2", {
                "text-destructive": options?.variant === "destructive",
              })}
            >
              {variantIcon()}
              {options?.title}
            </AlertDialogTitle>
            {options?.desc && (
              <AlertDialogDescription className="font-semibold">
                {options.desc}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          {options?.type === "prompt" && (
            <Input
              type="text"
              ref={inputRef}
              placeholder={options?.placeholder}
            />
          )}
          <AlertDialogFooter>
            {options?.type !== "alert" && (
              <AlertDialogCancel onClick={() => makeResolver("")}>
                {options?.cancelText ?? "취소"}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() =>
                makeResolver(
                  options?.type === "prompt"
                    ? inputRef.current?.value ?? ""
                    : "OK"
                )
              }
              className={cn(
                options?.variant === "destructive" && "bg-destructive"
              )}
            >
              {options?.okText ?? options?.type === "alert" ? "확인" : "진행"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlerterContext.Provider>
  );
}

// check!
export const useAlerter = () => use(AlerterContext);
