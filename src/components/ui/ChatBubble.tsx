import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChatBubbleProps {
  role: "user" | "bot";
  children: ReactNode;
  /** 봇 답변 하단에 표시되는 "📄 근거: ..." 출처 태그 */
  sourceTag?: string;
}

export function ChatBubble({ role, children, sourceTag }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="ml-auto max-w-[78%] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md bg-gradient-to-br from-brand to-[#3F7D5C] px-4 py-2.5 text-[13.5px] leading-[1.5] text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="mr-auto max-w-[82%] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md border-[1.5px] border-border bg-surface px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
      {children}
      {sourceTag && (
        <div
          className={cn(
            "mt-2 border-t border-dashed border-border pt-2 text-[11.5px] text-muted",
          )}
        >
          📄 근거: {sourceTag}
        </div>
      )}
    </div>
  );
}
