const RANK_GRADIENTS: Record<number, string> = {
  1: "linear-gradient(90deg,#4A7C59,#40916C)",
  2: "linear-gradient(90deg,#5C8A6E,#7DAA8C)",
  3: "linear-gradient(90deg,#9EA88F,#B8BFA8)",
};
const RANK_FALLBACK = "#C2BAA6";

interface ProgressBarProps {
  value: number;
  rank?: number;
}

export function ProgressBar({ value, rank = 1 }: ProgressBarProps) {
  const fill = RANK_GRADIENTS[rank] ?? RANK_FALLBACK;
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-canvas">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: fill }}
      />
    </div>
  );
}
