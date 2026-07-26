import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  /** 타이틀 위에 작게 표시되는 캡션 (예: 지역명, 부제) */
  caption?: string;
  /** 타이틀 오른쪽에 붙는 보조 액션 (예: "전체보기") */
  trailing?: ReactNode;
}

export function SectionHeader({ title, caption, trailing }: SectionHeaderProps) {
  return (
    <div>
      {caption && (
        <div className="mb-0.5 text-[12.5px] text-muted">{caption}</div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink">{title}</h2>
        {trailing}
      </div>
    </div>
  );
}
