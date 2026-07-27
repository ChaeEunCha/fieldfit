interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="밀짚모자를 쓰고 갈퀴를 든 농부"
    >
      <line x1="31" y1="37" x2="24" y2="19.5" stroke="#5B4632" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="19" x2="29" y2="19" stroke="#5B4632" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="20.5" y1="19" x2="20.5" y2="22.2" stroke="#5B4632" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="23.3" y1="19" x2="23.3" y2="22.6" stroke="#5B4632" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="26.1" y1="19" x2="26.1" y2="22.6" stroke="#5B4632" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="28.6" y1="19" x2="28.6" y2="22.2" stroke="#5B4632" strokeWidth="1.4" strokeLinecap="round" />

      <rect x="12" y="27" width="16" height="11" rx="5" fill="#8B6F47" />
      <rect x="17" y="24" width="6" height="5" fill="#F0C39A" />
      <circle cx="20" cy="20" r="7" fill="#F0C39A" />
      <circle cx="17.3" cy="20" r="1" fill="#2E2A22" />
      <circle cx="22.7" cy="20" r="1" fill="#2E2A22" />
      <path d="M17 23 Q20 25.5 23 23" stroke="#2E2A22" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      <ellipse cx="20" cy="15" rx="13" ry="3.2" fill="#E3B23C" />
      <path d="M11 15 Q20 2 29 15 Z" fill="#D9A62E" />
      <rect x="11" y="13.6" width="18" height="2.2" rx="1.1" fill="#4A7C59" />
    </svg>
  );
}
