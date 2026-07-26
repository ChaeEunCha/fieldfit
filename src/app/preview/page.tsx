"use client";

import { useState } from "react";
import {
  Badge,
  BottomNav,
  Button,
  Card,
  ChatBubble,
  Chip,
  CropScoreCard,
  RiskAlertItem,
  ScoreRankRow,
  SearchField,
  SectionHeader,
  SelectTile,
} from "@/components/ui";

const CROPS = [
  { key: "apple", icon: "🍎", label: "사과" },
  { key: "pear", icon: "🍐", label: "배" },
  { key: "cucumber", icon: "🥒", label: "오이" },
  { key: "potato", icon: "🥔", label: "감자" },
  { key: "lettuce", icon: "🥬", label: "상추" },
];

export default function ComponentPreviewPage() {
  const [selected, setSelected] = useState(new Set(["apple", "cucumber", "lettuce"]));

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-10 px-6 py-10">
      <h1 className="text-2xl font-extrabold text-brand-deep">
        FieldFit 공용 컴포넌트 미리보기
      </h1>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Button" />
        <div className="flex gap-3">
          <Button variant="primary">진단하기</Button>
          <Button variant="outline">⬇ .ics 파일 다운로드</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Badge" />
        <div className="flex gap-2">
          <Badge tone="risk">⚠ 서리 주의</Badge>
          <Badge tone="warning">병해 경보</Badge>
          <Badge tone="info">가뭄 주의</Badge>
          <Badge tone="neutral">보통</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="SearchField" />
        <SearchField placeholder="주소를 검색하세요 (예: 충북 제천시)" />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader
          title="SelectTile"
          caption="재배 희망 작물 (복수 선택 가능)"
        />
        <div className="grid grid-cols-3 gap-2.5">
          {CROPS.map((crop) => (
            <SelectTile
              key={crop.key}
              icon={crop.icon}
              label={crop.label}
              selected={selected.has(crop.key)}
              onClick={() => toggle(crop.key)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="ScoreRankRow" caption="충북 제천시 봉양읍" />
        <div className="flex flex-col gap-2.5">
          <ScoreRankRow rank={1} icon="🍎" label="사과" score={82} />
          <ScoreRankRow rank={2} icon="🥔" label="감자" score={75} />
          <ScoreRankRow rank={3} icon="🥬" label="상추" score={61} />
          <ScoreRankRow rank={4} icon="🥒" label="오이" score={48} muted />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="CropScoreCard" />
        <div className="grid grid-cols-2 gap-2.5">
          <CropScoreCard icon="🍎" label="사과" score={82} scoreColor="#4A7C59" />
          <CropScoreCard icon="🥔" label="감자" score={75} scoreColor="#5C8A6E" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="RiskAlertItem" />
        <div className="flex flex-col gap-2">
          <RiskAlertItem
            tone="risk"
            leading={
              <div>
                <div className="text-[9px]">4월</div>
                <div className="text-[15px] font-extrabold">5</div>
              </div>
            }
            title="🍎 사과 서리 주의보"
            description="개화기 서리 피해 위험 높음"
          />
          <RiskAlertItem
            tone="warning"
            leading={
              <div>
                <div className="text-[9px]">6월</div>
                <div className="text-[15px] font-extrabold">중</div>
              </div>
            }
            title="🥒 오이 병해 경보"
            description="노균병 발생 가능성 증가"
          />
          <RiskAlertItem
            tone="info"
            leading={
              <div>
                <div className="text-[9px]">7월</div>
                <div className="text-[15px] font-extrabold">초</div>
              </div>
            }
            title="🥔 감자 가뭄 주의"
            description="관수 필요 구간 진입"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Chip" />
        <div className="flex gap-2">
          <Chip selected>서리 위험은 언제까지?</Chip>
          <Chip>사과 점수 근거는?</Chip>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="ChatBubble" />
        <Card className="flex flex-col gap-3 bg-canvas">
          <ChatBubble role="user">지금 감자 심어도 될까요?</ChatBubble>
          <ChatBubble
            role="bot"
            sourceTag="재배 가이드 리포트 · 토양 데이터"
          >
            감자 파종 적기는 아직 <b>3주 남았습니다.</b> 현재 토양 온도가
            8℃로, 감자 발아 적정 온도(10~12℃)에 미치지 못해요.
          </ChatBubble>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="BottomNav" />
        <div className="overflow-hidden rounded-2xl border border-frame-border">
          <BottomNav
            items={[
              { href: "/preview", label: "홈", icon: "🏠" },
              { href: "/preview/diagnosis", label: "진단", icon: "📊" },
              { href: "/preview/calendar", label: "캘린더", icon: "📅" },
              { href: "/preview/chat", label: "챗봇", icon: "💬" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
