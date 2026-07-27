"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Chip,
  RiskAlertItem,
  SectionHeader,
  type BadgeTone,
} from "@/components/ui";
import {
  RiskEvent,
  RiskType,
  findRegion,
  getRiskEventsForRegion,
  toAbsoluteDate,
} from "@/lib/mock-data";
import { AlarmOffsetDays, buildIcsCalendar, downloadIcsFile } from "@/lib/ics";

const DEFAULT_REGION = "gochang";
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const RISK_TONE: Record<RiskType, Exclude<BadgeTone, "neutral">> = {
  저온: "risk",
  고온: "risk",
  "토양 병해": "warning",
};

const RISK_EMOJI: Record<RiskType, string> = {
  저온: "❄️",
  고온: "🔥",
  "토양 병해": "🦠",
};

const ALARM_OPTIONS: { value: AlarmOffsetDays; label: string }[] = [
  { value: 0, label: "당일" },
  { value: 1, label: "1일 전" },
  { value: 3, label: "3일 전" },
  { value: 7, label: "7일 전" },
];

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
  return cells;
}

function CalendarContent() {
  const searchParams = useSearchParams();
  const regionCode = searchParams.get("region") || DEFAULT_REGION;
  const region = findRegion(regionCode);
  const regionName = region?.name ?? regionCode;

  const events = useMemo(() => getRiskEventsForRegion(regionCode), [regionCode]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => toAbsoluteDate(a).getTime() - toAbsoluteDate(b).getTime(),
      ),
    [events],
  );

  const affectedCrops = useMemo(() => {
    const set = new Set<string>();
    events.forEach((event) => event.cropsAffected.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [events]);

  const initialDate = sortedEvents[0] ? toAbsoluteDate(sortedEvents[0]) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [alarmOffset, setAlarmOffset] = useState<AlarmOffsetDays>(1);

  const eventsByDateKey = useMemo(() => {
    const map = new Map<string, RiskEvent[]>();
    events.forEach((event) => {
      const key = dateKey(toAbsoluteDate(event));
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [events]);

  const monthCells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function goToPrevMonth() {
    const next = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleDownload() {
    const icsText = buildIcsCalendar(events, alarmOffset, regionName);
    downloadIcsFile(icsText, `fieldfit-${regionCode}-risk-calendar.ics`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink">위험 경고 캘린더</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          {affectedCrops.length > 0
            ? `${affectedCrops.join("·")} 통합 일정`
            : "등록된 위험 일정 없음"}
        </p>
      </div>

      {events.length === 0 ? (
        <Card>
          <p className="text-[13.5px] text-muted">
            현재 예보 기준 위험 시점 없음
          </p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="px-2 text-lg text-muted"
              aria-label="이전 달"
            >
              ‹
            </button>
            <div className="text-[15px] font-extrabold text-ink">
              {viewYear}년 {viewMonth + 1}월
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="px-2 text-lg text-muted"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-[11px] font-semibold text-placeholder">
                {label}
              </div>
            ))}
            {monthCells.map((date, index) => {
              if (!date) return <div key={index} />;
              const key = dateKey(date);
              const dayEvents = eventsByDateKey.get(key);
              const hasRisk = !!dayEvents && dayEvents.length > 0;
              const primaryType = dayEvents?.[0]?.type;

              return (
                <div
                  key={index}
                  className={
                    hasRisk
                      ? "flex flex-col items-center gap-0.5 rounded-xl border border-risk-border bg-risk-bg py-1.5"
                      : "flex flex-col items-center gap-0.5 py-1.5"
                  }
                >
                  <span className="text-[12px] font-semibold text-ink">
                    {date.getDate()}
                  </span>
                  {hasRisk && primaryType && (
                    <span className="text-[11px] leading-none">
                      {RISK_EMOJI[primaryType]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeader title="다가오는 위험 일정" />
            <div className="flex flex-col gap-2">
              {sortedEvents.map((event, index) => {
                const date = toAbsoluteDate(event);
                const tone =
                  event.type === "토양 병해" ? RISK_TONE["토양 병해"] : RISK_TONE[event.type];
                return (
                  <RiskAlertItem
                    key={index}
                    tone={tone}
                    leading={
                      <div>
                        <div className="text-[9px]">{date.getMonth() + 1}월</div>
                        <div className="text-[15px] font-extrabold">
                          {date.getDate()}
                        </div>
                      </div>
                    }
                    title={`${RISK_EMOJI[event.type]} ${event.cropsAffected.join("·")} ${event.type} ${event.level === "경고" ? "경보" : "주의보"}`}
                    description={event.message}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeader title="알림 수신 시점" />
            <div className="flex gap-2">
              {ALARM_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  selected={alarmOffset === option.value}
                  onClick={() => setAlarmOffset(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
            {alarmOffset === 7 && (
              <p className="text-[11.5px] text-muted">
                단기예보 특성상 정확도가 낮을 수 있음
              </p>
            )}
          </div>

          <Button variant="outline" className="w-full" onClick={handleDownload}>
            ⬇ .ics 파일 다운로드
          </Button>
        </>
      )}
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<Card>불러오는 중...</Card>}>
      <CalendarContent />
    </Suspense>
  );
}
