import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function SearchField({
  actionLabel = "검색",
  onAction,
  icon,
  className,
  ...props
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border-[1.5px] border-border-strong bg-surface px-4 py-3.5",
        className,
      )}
    >
      {icon ?? (
        <span className="h-[18px] w-[18px] shrink-0 rounded-full border-[2.5px] border-brand" />
      )}
      <input
        className="flex-1 bg-transparent text-[14.5px] text-ink placeholder:text-placeholder focus:outline-none"
        {...props}
      />
      <button
        type="button"
        onClick={onAction}
        className="text-[13px] font-bold text-brand"
      >
        {actionLabel}
      </button>
    </div>
  );
}
