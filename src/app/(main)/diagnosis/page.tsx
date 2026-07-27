"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Badge,
  type BadgeTone,
  Button,
  Card,
  ScoreRankRow,
  SectionHeader,
} from "@/components/ui";
import {
  CROPS,
  CropId,
  RiskLevel,
  RiskType,
  defaultPeriod,
  getCrop,
  getRegionDiagnosis,
} from "@/lib/mock-data";

const DEFAULT_REGION = "gochang";
const DEFAULT_CROPS = CROPS.map((crop) => crop.id);

const RISK_TONE: Record<RiskType, Exclude<BadgeTone, "neutral">> = {
  저온: "risk",
  고온: "risk",
  "토양 병해": "warning",
};

const RISK_LEVEL_ICON: Record<RiskLevel, string> = {
  경고: "⚠️",
  주의: "🔎",
};

function DiagnosisContent() {
  const searchParams = useSearchParams();
  const regionCode = searchParams.get("region") || DEFAULT_REGION;
  const period = searchParams.get("period") || defaultPeriod();
  const cropsCsv = searchParams.get("crops");
  const selectedCrops = cropsCsv
    ? (cropsCsv.split(",").filter(Boolean) as CropId[])
    : DEFAULT_CROPS;

  const diagnosis = getRegionDiagnosis(regionCode, period);

  if (!diagnosis || diagnosis.matrix.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <p className="text-[13.5px] text-muted">
          진단 결과를 불러올 수 없습니다.
        </p>
      </Card>
    );
  }

  const rankedMatrix = [...diagnosis.matrix].sort((a, b) => b.score - a.score);
  const topEntry = rankedMatrix[0];
  const topCrop = getCrop(topEntry.crop);

  const selectedRanked = rankedMatrix.filter((entry) =>
    selectedCrops.includes(entry.crop),
  );
  const ctaEntry = selectedRanked.length > 0 ? selectedRanked[0] : topEntry;
  const ctaCrop = getCrop(ctaEntry.crop);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 text-[12.5px] text-muted">{diagnosis.regionName}</div>
        <h1 className="text-xl font-extrabold text-ink">환경 적합도 진단 결과</h1>
      </div>

      <div className="flex flex-col gap-2.5">
        {rankedMatrix.map((entry, index) => {
          const crop = getCrop(entry.crop);
          const rank = index + 1;
          return (
            <ScoreRankRow
              key={entry.crop}
              rank={rank}
              icon={crop?.icon ?? "🌱"}
              label={crop?.nameKo ?? entry.crop}
              score={entry.score}
              muted={rank >= 4}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="산출 근거 데이터"
          caption={`${topCrop?.nameKo ?? topEntry.crop} 기준`}
        />
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col gap-1">
            <span className="text-[11.5px] text-muted">평균기온</span>
            <span className="text-base font-extrabold text-ink">
              {diagnosis.envStat.avgTempC}℃
            </span>
          </Card>
          <Card className="flex flex-col gap-1">
            <span className="text-[11.5px] text-muted">강수량</span>
            <span className="text-base font-extrabold text-ink">
              {diagnosis.envStat.annualPrecipitationMm.toLocaleString()}mm
            </span>
          </Card>
          <Card className="flex flex-col gap-1">
            <span className="text-[11.5px] text-muted">토양pH</span>
            <span className="text-base font-extrabold text-ink">
              {diagnosis.envStat.soilPh}
            </span>
          </Card>
          <Card className="flex flex-col gap-1">
            <span className="text-[11.5px] text-muted">일조시간</span>
            <span className="text-base font-extrabold text-ink">
              {diagnosis.envStat.sunshineHours.toLocaleString()}h
            </span>
          </Card>
        </div>
      </div>

      {topEntry.risks.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionHeader title="위험 신호" caption={`${topCrop?.nameKo ?? ""} 기준`} />
          <div className="flex flex-wrap gap-2">
            {topEntry.risks.map((risk, index) => (
              <Badge key={index} tone={RISK_TONE[risk.type]}>
                {RISK_LEVEL_ICON[risk.level]} {risk.type} {risk.level}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/report/${ctaEntry.crop}?region=${encodeURIComponent(regionCode)}&period=${encodeURIComponent(period)}`}
      >
        <Button variant="primary" className="w-full">
          {ctaCrop?.nameKo ?? ctaEntry.crop} 재배 가이드 보기 →
        </Button>
      </Link>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<Card>불러오는 중...</Card>}>
      <DiagnosisContent />
    </Suspense>
  );
}
