import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SelectTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  selected?: boolean;
}

export function SelectTile({
  icon,
  label,
  selected = false,
  className,
  ...props
}: SelectTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-4",
        selected
          ? "border-brand bg-chip-selected"
          : "border-border bg-surface",
        className,
      )}
      {...props}
    >
      {selected && (
        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
          ✓
        </span>
      )}
      <span className="text-[28px] leading-none">{icon}</span>
      <span
        className={cn(
          "text-[12.5px]",
          selected ? "font-bold text-ink" : "font-semibold text-ink-soft",
        )}
      >
        {label}
      </span>
    </button>
  );
}
