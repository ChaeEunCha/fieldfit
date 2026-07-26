import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border-[1.5px] border-border bg-surface p-4",
        className,
      )}
      {...props}
    />
  );
}
