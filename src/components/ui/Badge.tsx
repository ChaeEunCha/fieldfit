import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "risk" | "warning" | "info" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE_STYLES: Record<BadgeTone, string> = {
  risk: "bg-risk-bg border border-risk-border text-risk-text",
  warning: "bg-warning-bg border border-warning-text/30 text-warning-text",
  info: "bg-info-bg border border-info-border text-info-text",
  neutral: "bg-chip-selected border border-brand/30 text-brand",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        TONE_STYLES[tone],
        className,
      )}
      {...props}
    />
  );
}
