import { ReactNode } from "react";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/cn";

const RANK_BADGE_BG: Record<number, string> = {
  1: "#4A7C59",
  2: "#5C8A6E",
  3: "#9EA88F",
};
const RANK_BADGE_FALLBACK = "#C2BAA6";

const RANK_SCORE_COLOR: Record<number, string> = {
  1: "#4A7C59",
  2: "#4A6146",
  3: "#877E6B",
};
const RANK_SCORE_FALLBACK = "#A9A292";

interface ScoreRankRowProps {
  rank: number;
  icon: ReactNode;
  label: string;
  score: number;
  /** 4위 이하처럼 비활성 톤으로 표시할 때 */
  muted?: boolean;
}

export function ScoreRankRow({
  rank,
  icon,
  label,
  score,
  muted = false,
}: ScoreRankRowProps) {
  return (
    <Card
      className={cn("flex items-center gap-3 p-3.5", muted && "opacity-70")}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
        style={{ background: RANK_BADGE_BG[rank] ?? RANK_BADGE_FALLBACK }}
      >
        {rank}
      </span>
      <span className="text-[22px] leading-none">{icon}</span>
      <div className="flex-1">
        <div className="text-[14.5px] font-bold text-ink">{label}</div>
        <div className="mt-1.5">
          <ProgressBar value={score} rank={rank} />
        </div>
      </div>
      <div
        className="text-lg font-extrabold"
        style={{ color: RANK_SCORE_COLOR[rank] ?? RANK_SCORE_FALLBACK }}
      >
        {score}
        <span className="ml-0.5 text-[11px] font-semibold text-placeholder">
          점
        </span>
      </div>
    </Card>
  );
}
