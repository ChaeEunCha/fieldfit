import Link from "next/link";
import { Badge, Button, Card } from "@/components/ui";
import {
  CropId,
  defaultPeriod,
  getCrop,
  getReport,
  getRegionDiagnosis,
  findRegion,
} from "@/lib/mock-data";

const DEFAULT_REGION = "gochang";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ crop: string }>;
  searchParams: Promise<{ region?: string; period?: string }>;
}) {
  const { crop: cropParam } = await params;
  const { region: regionParam, period: periodParam } = await searchParams;

  const cropId = cropParam as CropId;
  const crop = getCrop(cropId);
  const regionCode = regionParam || DEFAULT_REGION;
  const period = periodParam || defaultPeriod();

  const region = findRegion(regionCode);
  const regionName = region?.name ?? regionCode;

  const report = getReport(regionCode, cropId, period);
  const diagnosis = getRegionDiagnosis(regionCode, period);
  const entry = diagnosis.matrix.find((m) => m.crop === cropId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{crop?.icon ?? "🌱"}</span>
          <h1 className="text-xl font-extrabold text-ink">
            {crop?.nameKo ?? cropId} 재배 가이드
          </h1>
        </div>
        <p className="text-[12.5px] text-muted">
          AI가 생성한 맞춤형 리포트 · {regionName}
        </p>
      </div>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-ink">
            ① 종합 진단 요약
          </h2>
          {entry && <Badge tone="neutral">{entry.grade}</Badge>}
        </div>
        <p className="text-[13.5px] leading-[1.6] text-ink-soft">
          {report.summary}
        </p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-[15px] font-extrabold text-ink">
          ② 토양·기후 설명
        </h2>
        <p className="text-[13.5px] leading-[1.6] text-ink-soft">
          {report.soilClimateExplainer}
        </p>
      </Card>

      <div className="flex flex-col gap-2 rounded-2xl border border-warning-text/30 bg-warning-bg p-4">
        <h2 className="text-[15px] font-extrabold text-ink">
          ③ 시기별 위험 경고 요약
        </h2>
        <p className="text-[13.5px] leading-[1.6] text-warning-text">
          {report.riskGuidance}
        </p>
      </div>

      <p className="text-[11.5px] leading-[1.6] text-placeholder">
        {report.disclaimer}
      </p>

      <div className="flex flex-col gap-3">
        <Link href={`/calendar?region=${encodeURIComponent(regionCode)}`}>
          <Button variant="primary" className="w-full">
            위험 캘린더로 보기 →
          </Button>
        </Link>
        <Link
          href={`/chat?region=${encodeURIComponent(regionCode)}&crop=${encodeURIComponent(cropId)}`}
        >
          <Button variant="outline" className="w-full">
            💬 챗봇에게 더 물어보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
