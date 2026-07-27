"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Badge,
  type BadgeTone,
  Button,
  Card,
  CropScoreCard,
  RiskAlertItem,
  SectionHeader,
} from "@/components/ui";
import {
  CROPS,
  CropId,
  RiskType,
  defaultPeriod,
  getCrop,
  getRegionDiagnosis,
  getRiskEventsForRegion,
  toAbsoluteDate,
} from "@/lib/mock-data";

const DEFAULT_REGION = "gochang";
const ZONE_COUNT = 6;
const ZONES_STORAGE_KEY = "fieldfit.zones";
const PERSONA_NAME = "김도현";

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

const RANK_SCORE_COLOR: Record<number, string> = {
  1: "#4A7C59",
  2: "#5C8A6E",
  3: "#877E6B",
};
const RANK_SCORE_FALLBACK = "#A9A292";

type ZoneAssignment = (CropId | null)[];

const EMPTY_ZONES: ZoneAssignment = Array(ZONE_COUNT).fill(null);

function parseZones(raw: string | null): ZoneAssignment {
  if (!raw) return EMPTY_ZONES;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_ZONES;
    return EMPTY_ZONES.map((_, index) => (parsed[index] as CropId | null) ?? null);
  } catch {
    return EMPTY_ZONES;
  }
}

/**
 * localStorage is a genuine external store, so useSyncExternalStore reads it
 * without the setState-in-effect render cascade — and its getServerSnapshot
 * keeps SSR/first-paint stable (avoiding a hydration mismatch) while still
 * picking up the persisted value as soon as the client subscribes.
 */
function subscribeToZonesStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function useZonesStorage(): [ZoneAssignment, (zones: ZoneAssignment) => void] {
  const getSnapshot = useCallback(
    () => window.localStorage.getItem(ZONES_STORAGE_KEY),
    [],
  );
  const getServerSnapshot = useCallback(() => null, []);
  const raw = useSyncExternalStore(
    subscribeToZonesStorage,
    getSnapshot,
    getServerSnapshot,
  );
  const zones = useMemo(() => parseZones(raw), [raw]);

  const setZones = useCallback((next: ZoneAssignment) => {
    window.localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(next));
    // Same-tab writes don't fire the "storage" event, so nudge a re-read.
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return [zones, setZones];
}

export default function HomePage() {
  const diagnosis = getRegionDiagnosis(DEFAULT_REGION, defaultPeriod());
  const rankedMatrix = useMemo(
    () => [...diagnosis.matrix].sort((a, b) => b.score - a.score),
    [diagnosis.matrix],
  );
  const topEntry = rankedMatrix[0];
  const topCrop = getCrop(topEntry.crop);

  const riskEvents = useMemo(
    () => getRiskEventsForRegion(DEFAULT_REGION),
    [],
  );
  const upcomingRisks = useMemo(
    () =>
      [...riskEvents]
        .sort((a, b) => toAbsoluteDate(a).getTime() - toAbsoluteDate(b).getTime())
        .slice(0, 3),
    [riskEvents],
  );
  const now = useMemo(() => new Date().getTime(), []);

  const [zones, setZones] = useZonesStorage();
  const [activeZoneIndex, setActiveZoneIndex] = useState<number | null>(null);

  function assignZone(index: number, cropId: CropId | null) {
    const next = [...zones];
    next[index] = cropId;
    setZones(next);
    setActiveZoneIndex(null);
  }

  function zoneStatus(cropId: CropId | null): { label: string; tone: BadgeTone } {
    if (!cropId) return { label: "미배정", tone: "neutral" };
    const cropName = getCrop(cropId)?.nameKo;
    const matchedEvents = riskEvents.filter((event) =>
      event.cropsAffected.includes(cropName ?? ""),
    );
    if (matchedEvents.some((event) => event.level === "경고")) {
      return { label: "위험", tone: "risk" };
    }
    if (matchedEvents.some((event) => event.level === "주의")) {
      return { label: "주의", tone: "warning" };
    }
    return { label: "정상", tone: "neutral" };
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-ink">
          안녕하세요 👋 {PERSONA_NAME}님의 농장
        </h1>
        <span className="text-xl leading-none text-muted">🔔</span>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-brand-deep to-brand-brown p-5 text-white">
        <div className="text-[12px] opacity-80">{diagnosis.regionName}</div>
        <div className="mt-1 flex items-center gap-2 text-xl font-extrabold">
          <span>{topCrop?.icon}</span>
          <span>{topCrop?.nameKo}</span>
          <span>· {topEntry.score}점</span>
        </div>
        <div className="mt-3 flex gap-2">
          {rankedMatrix.slice(1, 3).map((entry, index) => {
            const crop = getCrop(entry.crop);
            return (
              <span
                key={entry.crop}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold"
              >
                {index + 2}위 {crop?.icon} {crop?.nameKo} {entry.score}점
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="다가오는 위험 알림"
          trailing={
            <Link href="/calendar" className="text-[12.5px] font-bold text-brand">
              전체보기
            </Link>
          }
        />
        <div className="flex flex-col gap-2">
          {upcomingRisks.map((event, index) => {
            const days = Math.round(
              (toAbsoluteDate(event).getTime() - now) / 86_400_000,
            );
            return (
              <RiskAlertItem
                key={index}
                tone={RISK_TONE[event.type]}
                leading={
                  <div className="text-[11px] font-extrabold">D-{days}</div>
                }
                title={`${RISK_EMOJI[event.type]} ${event.cropsAffected.join("·")} ${event.type} ${event.level === "경고" ? "경보" : "주의보"}`}
                description={event.message}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="나의 진단 작물" />
        <div className="grid grid-cols-2 gap-2.5">
          {rankedMatrix.map((entry, index) => {
            const crop = getCrop(entry.crop);
            return (
              <CropScoreCard
                key={entry.crop}
                icon={crop?.icon ?? "🌱"}
                label={crop?.nameKo ?? entry.crop}
                score={entry.score}
                scoreColor={RANK_SCORE_COLOR[index + 1] ?? RANK_SCORE_FALLBACK}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="밭 구역 관리" caption="구역을 눌러 작물을 배정하세요" />
        <div className="grid grid-cols-3 gap-2.5">
          {zones.map((cropId, index) => {
            const crop = cropId ? getCrop(cropId) : undefined;
            const status = zoneStatus(cropId);
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveZoneIndex(index)}
                className="flex flex-col items-center gap-1.5 rounded-2xl border-[1.5px] border-border bg-surface px-2 py-3.5"
              >
                <span className="text-xl leading-none">
                  {crop ? crop.icon : "+"}
                </span>
                <span className="text-[11.5px] font-semibold text-ink">
                  {crop ? crop.nameKo : `구역 ${index + 1}`}
                </span>
                <Badge tone={status.tone} className="px-2 py-0.5 text-[10px]">
                  {status.label}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {activeZoneIndex !== null && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-ink/40 sm:items-center"
          onClick={() => setActiveZoneIndex(null)}
        >
          <Card
            className="mx-auto w-full max-w-md rounded-b-none bg-surface p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-[14.5px] font-extrabold text-ink">
              구역 {activeZoneIndex + 1}에 작물 배정
            </div>
            <div className="flex flex-col gap-2">
              {CROPS.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => assignZone(activeZoneIndex, crop.id)}
                  className="flex items-center gap-2 rounded-xl border-[1.5px] border-border px-3 py-2.5 text-left text-[13.5px] font-semibold text-ink"
                >
                  <span className="text-lg">{crop.icon}</span>
                  {crop.nameKo}
                </button>
              ))}
              <button
                type="button"
                onClick={() => assignZone(activeZoneIndex, null)}
                className="rounded-xl border-[1.5px] border-border px-3 py-2.5 text-left text-[13.5px] font-semibold text-muted"
              >
                비우기
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/onboarding" className="flex-1">
          <Button variant="outline" className="w-full">
            + 새 진단하기
          </Button>
        </Link>
        <Link href="/chat" className="flex-1">
          <Button variant="primary" className="w-full">
            💬 챗봇에게 묻기
          </Button>
        </Link>
      </div>
    </div>
  );
}
