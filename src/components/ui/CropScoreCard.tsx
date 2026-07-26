import { ReactNode } from "react";
import { Card } from "./Card";

interface CropScoreCardProps {
  icon: ReactNode;
  label: string;
  score: number;
  /** 순위별 강조색 (예: 1위 #4A7C59, 2위 #5C8A6E) */
  scoreColor?: string;
}

export function CropScoreCard({
  icon,
  label,
  score,
  scoreColor = "#4A7C59",
}: CropScoreCardProps) {
  return (
    <Card className="flex items-center gap-2 p-3">
      <span className="text-xl leading-none">{icon}</span>
      <div>
        <div className="text-[12.5px] font-bold text-ink">{label}</div>
        <div className="text-[11px] font-bold" style={{ color: scoreColor }}>
          {score}점
        </div>
      </div>
    </Card>
  );
}
