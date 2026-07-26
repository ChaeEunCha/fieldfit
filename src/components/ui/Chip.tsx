import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors",
        selected
          ? "bg-chip-selected text-brand"
          : "border-[1.5px] border-border bg-surface text-muted",
        className,
      )}
      {...props}
    />
  );
}
