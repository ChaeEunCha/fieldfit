import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BadgeTone } from "./Badge";

interface RiskAlertItemProps {
  tone: Exclude<BadgeTone, "neutral">;
  leading: ReactNode;
  title: string;
  description: string;
}

const TONE_BG: Record<RiskAlertItemProps["tone"], string> = {
  risk: "bg-risk-bg",
  warning: "bg-warning-bg",
  info: "bg-info-bg",
};

const TONE_TEXT: Record<RiskAlertItemProps["tone"], string> = {
  risk: "text-risk-text",
  warning: "text-warning-text",
  info: "text-info-text",
};

export function RiskAlertItem({
  tone,
  leading,
  title,
  description,
}: RiskAlertItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
        TONE_BG[tone],
      )}
    >
      <div className={cn("shrink-0 text-center", TONE_TEXT[tone])}>
        {leading}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-bold text-ink">{title}</div>
        <div className={cn("text-[11px] opacity-80", TONE_TEXT[tone])}>
          {description}
        </div>
      </div>
    </div>
  );
}
