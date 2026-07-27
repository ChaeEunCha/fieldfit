"use client";

import { Suspense, SubmitEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, ChatBubble, Chip } from "@/components/ui";
import {
  CHAT_QA_PRESETS,
  CHAT_OUT_OF_SCOPE_ANSWER,
  CHAT_OUT_OF_SCOPE_QUESTION,
  getCrop,
  findRegion,
  matchChatAnswer,
} from "@/lib/mock-data";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  sourceTag?: string;
}

const SUGGESTED_CHIPS = [
  ...CHAT_QA_PRESETS.map((preset) => ({
    label: preset.label,
    sampleQuestion: preset.sampleQuestion,
  })),
  { label: "농약 방제 문의", sampleQuestion: CHAT_OUT_OF_SCOPE_QUESTION },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const regionCode = searchParams.get("region");
  const cropParam = searchParams.get("crop");

  const region = regionCode ? findRegion(regionCode) : undefined;
  const crop = cropParam ? getCrop(cropParam) : undefined;

  const openingMessage = useMemo(() => {
    if (crop && region) {
      return `안녕하세요! ${region.name} · ${crop.nameKo} 재배 가이드를 기준으로 궁금한 점을 답변해드릴게요.`;
    }
    if (region) {
      return `안녕하세요! ${region.name} 진단 결과를 기준으로 궁금한 점을 답변해드릴게요.`;
    }
    return "안녕하세요! FieldFit 어시스턴트예요. 리포트 근거로 답변해드릴게요.";
  }, [region, crop]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: openingMessage },
  ]);
  const [input, setInput] = useState("");

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { answer, sourceSection } = matchChatAnswer(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      {
        role: "bot",
        text: answer || CHAT_OUT_OF_SCOPE_ANSWER,
        sourceTag: sourceSection,
      },
    ]);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-chip-selected text-lg">
          🌾
        </span>
        <div>
          <div className="text-[14.5px] font-extrabold text-ink">
            FieldFit 어시스턴트
          </div>
          <div className="text-[11.5px] text-muted">
            리포트 근거로 답변해요
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role === "bot" ? "bot" : "user"} sourceTag={message.sourceTag}>
            {message.text}
          </ChatBubble>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUGGESTED_CHIPS.map((chip) => (
          <Chip key={chip.label} onClick={() => sendMessage(chip.sampleQuestion)}>
            {chip.label}
          </Chip>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요"
          className="flex-1 rounded-2xl border-[1.5px] border-border-strong bg-surface px-4 py-3.5 text-[14.5px] text-ink placeholder:text-placeholder focus:outline-none"
        />
        <button
          type="submit"
          aria-label="전송"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-brown text-white shadow-cta"
        >
          ↑
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<Card>불러오는 중...</Card>}>
      <ChatContent />
    </Suspense>
  );
}
