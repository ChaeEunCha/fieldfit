"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BrandMark,
  Button,
  Card,
  SearchField,
  SectionHeader,
  SelectTile,
} from "@/components/ui";
import { CROPS as ALL_CROPS, CURATED_REGIONS, CropId } from "@/lib/mock-data";

function defaultPeriodOptions(): string[] {
  const options: string[] = [];
  const base = new Date();
  for (let i = 1; i <= 6; i += 1) {
    const date = new Date(base.getFullYear(), base.getMonth() + i, 1);
    options.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return options;
}

type LoadingStep = "idle" | "weather" | "soil" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const periodOptions = useMemo(() => defaultPeriodOptions(), []);

  const [regionQuery, setRegionQuery] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<Set<CropId>>(new Set());
  const [period, setPeriod] = useState(periodOptions[0]);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");

  const regionCode = useMemo(() => {
    const trimmed = regionQuery.trim();
    if (!trimmed) return "";
    const matched = CURATED_REGIONS.find(
      (region) => region.name === trimmed || region.name.includes(trimmed),
    );
    if (matched) return matched.code;
    return trimmed
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/(^-|-$)/g, "");
  }, [regionQuery]);

  const canSubmit = regionQuery.trim().length > 0 && selectedCrops.size > 0;

  function toggleCrop(cropId: CropId) {
    setSelectedCrops((prev) => {
      const next = new Set(prev);
      if (next.has(cropId)) next.delete(cropId);
      else next.add(cropId);
      return next;
    });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setLoadingStep("weather");
  }

  useEffect(() => {
    if (loadingStep === "weather") {
      const timer = setTimeout(() => setLoadingStep("soil"), 900);
      return () => clearTimeout(timer);
    }
    if (loadingStep === "soil") {
      const timer = setTimeout(() => setLoadingStep("done"), 900);
      return () => clearTimeout(timer);
    }
    if (loadingStep === "done") {
      const timer = setTimeout(() => {
        const cropsCsv = Array.from(selectedCrops).join(",");
        router.push(
          `/diagnosis?region=${encodeURIComponent(regionCode)}&crops=${encodeURIComponent(cropsCsv)}&period=${encodeURIComponent(period)}`,
        );
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loadingStep, regionCode, selectedCrops, period, router]);

  const isLoading = loadingStep !== "idle";

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center gap-2.5">
        <BrandMark size={40} />
        <span className="text-lg font-extrabold text-brand-deep">FieldFit</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-extrabold text-ink">
          재배 예정지와 작물을 알려주세요
        </h1>
        <p className="text-[13px] text-muted">
          공공데이터 기반으로 환경 적합도를 진단해요
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="재배 예정지" />
        <SearchField
          placeholder="주소를 검색하세요 (예: 충북 제천시)"
          value={regionQuery}
          onChange={(e) => setRegionQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {CURATED_REGIONS.map((region) => (
            <button
              key={region.code}
              type="button"
              onClick={() => setRegionQuery(region.name)}
              className="rounded-full border-[1.5px] border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-muted"
            >
              {region.name}
            </button>
          ))}
        </div>
        {regionQuery.trim().length === 0 && (
          <p className="text-[12px] text-risk-text">
            재배 예정지를 입력해주세요.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="재배 희망 작물" caption="복수 선택 가능" />
        <div className="grid grid-cols-3 gap-2.5">
          {ALL_CROPS.map((crop) => (
            <SelectTile
              key={crop.id}
              icon={crop.icon}
              label={crop.nameKo}
              selected={selectedCrops.has(crop.id)}
              onClick={() => toggleCrop(crop.id)}
            />
          ))}
        </div>
        {selectedCrops.size === 0 && (
          <p className="text-[12px] text-risk-text">
            작물을 1개 이상 선택해주세요.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="재배 예정 시기" />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-2xl border-[1.5px] border-border-strong bg-surface px-4 py-3.5 text-[14.5px] text-ink focus:outline-none"
        >
          {periodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-auto">
        <Button
          variant="primary"
          className="w-full"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          진단하기
        </Button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-3xl bg-surface/95 px-8 backdrop-blur-sm">
          <Card className="flex w-full flex-col gap-4 bg-canvas p-6">
            <div className="flex items-center gap-3">
              <span
                className={
                  loadingStep === "weather" || loadingStep === "soil" || loadingStep === "done"
                    ? "text-brand"
                    : "text-placeholder"
                }
              >
                {loadingStep === "weather" ? "⏳" : "✅"}
              </span>
              <span className="text-[13.5px] font-semibold text-ink">
                {regionQuery || regionCode} 지역 기상 데이터 조회 완료
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  loadingStep === "soil" || loadingStep === "done"
                    ? "text-brand"
                    : "text-placeholder"
                }
              >
                {loadingStep === "soil" ? "⏳" : loadingStep === "done" ? "✅" : "○"}
              </span>
              <span className="text-[13.5px] font-semibold text-ink">
                토양 성분 데이터 조회 완료
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
