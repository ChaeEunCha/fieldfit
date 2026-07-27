export type CropId = "apple" | "pear" | "cucumber" | "potato" | "lettuce";

export interface Crop {
  id: CropId;
  nameKo: string;
  icon: string;
}

export const CROPS: Crop[] = [
  { id: "apple", nameKo: "사과", icon: "🍎" },
  { id: "pear", nameKo: "배", icon: "🍐" },
  { id: "cucumber", nameKo: "오이", icon: "🥒" },
  { id: "potato", nameKo: "감자", icon: "🥔" },
  { id: "lettuce", nameKo: "상추", icon: "🥬" },
];

export function getCrop(cropId: string): Crop | undefined {
  return CROPS.find((crop) => crop.id === cropId);
}

export interface CropStandard {
  cropId: CropId;
  optimalTempMinC: number;
  optimalTempMaxC: number;
  lowTempRiskC: number;
  highTempRiskC: number;
  optimalPhMin: number;
  optimalPhMax: number;
  note: string;
  source: string;
}

export const CROP_STANDARDS: Record<CropId, CropStandard> = {
  apple: {
    cropId: "apple",
    optimalTempMinC: 15,
    optimalTempMaxC: 25,
    lowTempRiskC: -2,
    highTempRiskC: 33,
    optimalPhMin: 5.5,
    optimalPhMax: 6.5,
    note: "개화기(4월경) 서리 피해에 특히 취약",
    source: "농촌진흥청 표준영농교본(잠정치)",
  },
  pear: {
    cropId: "pear",
    optimalTempMinC: 15,
    optimalTempMaxC: 25,
    lowTempRiskC: -1.7,
    highTempRiskC: 33,
    optimalPhMin: 5.5,
    optimalPhMax: 6.5,
    note: "사과와 유사하나 개화 시기가 약간 빠름",
    source: "농촌진흥청 표준영농교본(잠정치)",
  },
  cucumber: {
    cropId: "cucumber",
    optimalTempMinC: 18,
    optimalTempMaxC: 28,
    lowTempRiskC: 10,
    highTempRiskC: 30,
    optimalPhMin: 5.5,
    optimalPhMax: 6.8,
    note: "저온에 특히 민감, 정식 초기 보온 필요(야간 13~15°C)",
    source: "농촌진흥청 표준영농교본(잠정치)",
  },
  potato: {
    cropId: "potato",
    optimalTempMinC: 14,
    optimalTempMaxC: 20,
    lowTempRiskC: 0,
    highTempRiskC: 25,
    optimalPhMin: 5.0,
    optimalPhMax: 6.0,
    note: "약산성 선호(더뎅이병 예방), pH 6.5 초과 시 병해 위험 상승",
    source: "농촌진흥청 표준영농교본(잠정치)",
  },
  lettuce: {
    cropId: "lettuce",
    optimalTempMinC: 15,
    optimalTempMaxC: 20,
    lowTempRiskC: 5,
    highTempRiskC: 25,
    optimalPhMin: 6.0,
    optimalPhMax: 6.8,
    note: "서늘한 기후 선호, 고온기 재배 시 추대 관리 필요",
    source: "농촌진흥청 표준영농교본(잠정치)",
  },
};

export type FitGrade = "매우적합" | "적합" | "보통" | "주의" | "부적합";

export function gradeFromScore(score: number): FitGrade {
  if (score >= 85) return "매우적합";
  if (score >= 70) return "적합";
  if (score >= 50) return "보통";
  if (score >= 30) return "주의";
  return "부적합";
}

export interface FitScoreResult {
  score: number;
  grade: FitGrade;
  temperatureScore: number;
  soilPhScore: number;
}

/**
 * 통합기획문서 19.1절: 종합 점수 = 온도 적합도×0.6 + 토양 적합도×0.4
 * tempScore, soilPhScore는 0~100 범위로 사전 산정된 값을 받는다(19.2절 산정 규칙은
 * 실서비스에서 기상/토양 원자료로부터 계산 — 예선은 mock 값을 그대로 사용).
 */
export function computeFitScore(
  crop: CropId,
  tempScore: number,
  soilPhScore: number,
): FitScoreResult {
  void crop;
  const clampedTemp = Math.min(100, Math.max(0, tempScore));
  const clampedSoil = Math.min(100, Math.max(0, soilPhScore));
  const score = Math.round(clampedTemp * 0.6 + clampedSoil * 0.4);
  return {
    score,
    grade: gradeFromScore(score),
    temperatureScore: clampedTemp,
    soilPhScore: clampedSoil,
  };
}

export interface Region {
  code: string;
  name: string;
}

export const CURATED_REGIONS: Region[] = [
  { code: "gochang", name: "전북 고창" },
  { code: "jecheon-bongyang", name: "충북 제천시 봉양읍" },
  { code: "sangju", name: "경북 상주" },
  { code: "naju", name: "전남 나주" },
  { code: "haenam", name: "전남 해남" },
];

export function findRegion(query: string): Region | undefined {
  const trimmed = query.trim();
  if (!trimmed) return undefined;
  return CURATED_REGIONS.find(
    (region) => region.name === trimmed || region.code === trimmed,
  );
}

/**
 * 온보딩의 "재배 예정 시기" 기본값과 동일한 규칙(오늘 기준 다음 달)으로 계산한다.
 * 데모를 언제 켜서 보든 "지금"과 어긋나지 않는 기본 시기를 만들기 위함 — 특정
 * 달을 하드코딩하면 실제 날짜가 지난 뒤에는 항상 과거 시점을 가리키게 된다.
 */
export function defaultPeriod(monthsFromNow: number = 1): string {
  const base = new Date();
  const date = new Date(base.getFullYear(), base.getMonth() + monthsFromNow, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function periodToKoreanLabel(period: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) return period;
  return `${match[1]}년 ${Number(match[2])}월`;
}

export interface EnvStat {
  avgTempC: number;
  annualPrecipitationMm: number;
  soilPh: number;
  sunshineHours: number;
}

export interface CropFitEntry {
  crop: CropId;
  score: number;
  grade: FitGrade;
  subScores: {
    temperature: number;
    soilPh: number;
  };
  risks: {
    type: "저온" | "고온" | "토양 병해";
    level: "주의" | "경고";
    description: string;
  }[];
}

export interface RegionDiagnosis {
  regionCode: string;
  regionName: string;
  period: string;
  envStat: EnvStat;
  matrix: CropFitEntry[];
}

/**
 * 문자열 해시 기반 시드 생성기.
 * Math.random()/Date.now()는 SSR과 CSR에서 다른 값을 낼 수 있어 hydration mismatch를
 * 일으키고, 새로고침마다 값이 바뀌어 PRD 6절의 "새로고침해도 값 일관성 유지" 요구를 어긴다.
 * 문자열을 해시해 결정론적 시드로 쓰면 같은 입력에 항상 같은 결과가 나온다.
 */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * 통합기획문서 19.2절 산정 규칙: 적정 범위 안이면 100점, 범위를 벗어난 만큼
 * 감점하고, 18장 위험 기준(저온/고온)을 넘으면 20점 이하로 처리한다.
 * 온도 점수를 실제 기온값으로부터 계산해야, 큐레이션 지역이든 임의 지역이든
 * "몇 월을 고르든" 정확히 그 달의 기온 기준으로 재계산된다 — 특정 달의 점수를
 * 미리 굳혀두면 다른 달을 고를 때 계절과 안 맞는 값이 그대로 남는다.
 */
function scoreTemperatureFit(actualTemp: number, standard: CropStandard): number {
  const { optimalTempMinC: min, optimalTempMaxC: max, lowTempRiskC: lowRisk, highTempRiskC: highRisk } = standard;
  if (actualTemp >= min && actualTemp <= max) return 100;
  if (actualTemp < min) {
    if (actualTemp <= lowRisk) return 15;
    const ratio = (min - actualTemp) / (min - lowRisk);
    return Math.round(100 - ratio * 75);
  }
  if (actualTemp >= highRisk) return 15;
  const ratio = (actualTemp - max) / (highRisk - max);
  return Math.round(100 - ratio * 75);
}

function scorePhFit(soilPh: number, phMin: number, phMax: number): number {
  if (soilPh >= phMin && soilPh <= phMax) return 100;
  const distance = soilPh < phMin ? phMin - soilPh : soilPh - phMax;
  return Math.max(30, Math.round(100 - distance * 40));
}

function buildRiskList(
  crop: CropId,
  actualTemp: number,
  standard: CropStandard,
): CropFitEntry["risks"] {
  const cropName = getCrop(crop)?.nameKo ?? crop;
  const risks: CropFitEntry["risks"] = [];
  if (actualTemp <= standard.lowTempRiskC) {
    risks.push({
      type: "저온",
      level: "경고",
      description: `예보 기준 기온이 ${cropName} 저온 위험 기준(${standard.lowTempRiskC}°C) 이하로 예상됩니다.`,
    });
  } else if (actualTemp < standard.optimalTempMinC) {
    risks.push({
      type: "저온",
      level: "주의",
      description: `예보 기준 기온이 ${cropName} 생육 적정 범위보다 낮게 예상됩니다.`,
    });
  }
  if (actualTemp >= standard.highTempRiskC) {
    risks.push({
      type: "고온",
      level: "경고",
      description: `예보 기준 기온이 ${cropName} 고온 위험 기준(${standard.highTempRiskC}°C) 이상 지속될 것으로 예상됩니다.`,
    });
  } else if (actualTemp > standard.optimalTempMaxC) {
    risks.push({
      type: "고온",
      level: "주의",
      description: `예보 기준 기온이 ${cropName} 생육 적정 범위보다 높게 예상됩니다.`,
    });
  }
  return risks;
}

function generateCropFitEntry(regionCode: string, crop: CropId, actualTemp: number): CropFitEntry {
  const standard = CROP_STANDARDS[crop];
  const tempScore = scoreTemperatureFit(actualTemp, standard);
  const soilSeed = hashString(`${regionCode}:${crop}:soil`);
  const soilPhScore = 40 + (soilSeed % 56);
  const { score, grade } = computeFitScore(crop, tempScore, soilPhScore);

  return {
    crop,
    score,
    grade,
    subScores: { temperature: tempScore, soilPh: soilPhScore },
    risks: buildRiskList(crop, actualTemp, standard),
  };
}

/** 지역별 월평균기온(°C) 추정치 — 1월~12월. 실서비스에서는 기상청 평년값으로 대체. */
const MONTHLY_AVG_TEMP_C: Record<string, number[]> = {
  gochang: [1.5, 3.0, 7.5, 13.5, 18.5, 22.5, 25.5, 26.5, 22.0, 16.0, 9.0, 3.0],
  "jecheon-bongyang": [-3.0, -0.5, 5.5, 12.5, 18.0, 22.0, 25.0, 25.5, 20.0, 13.0, 5.5, -1.0],
};
const GENERIC_MONTHLY_TEMP_C = [1.0, 3.0, 8.0, 14.0, 19.0, 23.0, 26.0, 27.0, 22.0, 15.0, 8.0, 2.0];

function monthOf(period: string): number {
  const month = Number(period.split("-")[1]);
  return Number.isFinite(month) && month >= 1 && month <= 12 ? month : 1;
}

function generateEnvStat(regionCode: string, period: string): EnvStat {
  const seed = hashString(`${regionCode}:env`);
  const base = GENERIC_MONTHLY_TEMP_C[monthOf(period) - 1];
  const variance = (seed % 40) / 10 - 2;
  return {
    avgTempC: Math.round((base + variance) * 10) / 10,
    annualPrecipitationMm: 1000 + (seed % 500),
    soilPh: Math.round((5.2 + (seed % 15) / 10) * 10) / 10,
    sunshineHours: 1900 + (seed % 400),
  };
}

/**
 * 고창/제천 봉양읍은 통합기획문서 17.1/17.2절·design.md 와이어프레임에 나온
 * 지역 고유값(토양pH·강수량·일조시간)만 고정 큐레이션이고, 기온·점수·등급·위험은
 * 선택된 period의 월평균기온으로 매번 다시 계산한다. 기온 하나를 고정값으로
 * 박아두면 "봄철 저온" 같은 특정 계절 얘기가 다른 달(예: 한여름)에도 그대로
 * 남아 실제 기후와 모순되기 때문이다.
 */
const CURATED_REGION_FACTS: Record<
  string,
  { regionName: string; annualPrecipitationMm: number; soilPh: number; sunshineHours: number }
> = {
  gochang: {
    regionName: "전북 고창",
    annualPrecipitationMm: 1250,
    soilPh: 6.1,
    sunshineHours: 2050,
  },
  "jecheon-bongyang": {
    regionName: "충북 제천시 봉양읍",
    annualPrecipitationMm: 1320,
    soilPh: 6.2,
    sunshineHours: 2180,
  },
};

function curatedAvgTemp(regionCode: string, period: string): number {
  const table = MONTHLY_AVG_TEMP_C[regionCode];
  return table ? table[monthOf(period) - 1] : GENERIC_MONTHLY_TEMP_C[monthOf(period) - 1];
}

export function getRegionDiagnosis(
  regionCode: string,
  period: string,
): RegionDiagnosis {
  const facts = CURATED_REGION_FACTS[regionCode];
  if (facts) {
    const avgTempC = curatedAvgTemp(regionCode, period);
    const matrix = CROPS.map((crop) => generateCropFitEntry(regionCode, crop.id, avgTempC))
      .map((entry) => ({
        ...entry,
        subScores: {
          temperature: entry.subScores.temperature,
          soilPh: scorePhFit(facts.soilPh, CROP_STANDARDS[entry.crop].optimalPhMin, CROP_STANDARDS[entry.crop].optimalPhMax),
        },
      }))
      .map((entry) => {
        const { score, grade } = computeFitScore(entry.crop, entry.subScores.temperature, entry.subScores.soilPh);
        return { ...entry, score, grade };
      })
      .sort((a, b) => b.score - a.score);

    return {
      regionCode,
      regionName: facts.regionName,
      period,
      envStat: {
        avgTempC,
        annualPrecipitationMm: facts.annualPrecipitationMm,
        soilPh: facts.soilPh,
        sunshineHours: facts.sunshineHours,
      },
      matrix,
    };
  }

  const region = CURATED_REGIONS.find((r) => r.code === regionCode);
  const regionName = region?.name ?? regionCode;
  const envStat = generateEnvStat(regionCode, period);
  const matrix = CROPS.map((crop) => generateCropFitEntry(regionCode, crop.id, envStat.avgTempC));

  return {
    regionCode,
    regionName,
    period,
    envStat,
    matrix: matrix.sort((a, b) => b.score - a.score),
  };
}

export type RiskType = "저온" | "고온" | "토양 병해";
export type RiskLevel = "주의" | "경고";

export interface RiskEvent {
  region: string;
  cropsAffected: string[];
  type: RiskType;
  level: RiskLevel;
  /** 매년 반복되는 계절성 위험이라 특정 연도가 아니라 월-일로 표현하고,
   *  오늘 이후 가장 가까운 발생일을 계산해 쓴다(nextOccurrence 참고). */
  month: number;
  day: number;
  message: string;
  alarmOffsetDays: 0 | 1 | 3 | 7;
}

export const RISK_EVENTS: RiskEvent[] = [
  {
    region: "gochang",
    cropsAffected: ["사과", "배"],
    type: "저온",
    level: "주의",
    month: 3,
    day: 14,
    message: "야간 최저기온이 사과 활착 적정 범위보다 낮게 예상됩니다.",
    alarmOffsetDays: 1,
  },
  {
    region: "gochang",
    cropsAffected: ["오이"],
    type: "고온",
    level: "주의",
    month: 6,
    day: 15,
    message: "고온 지속으로 오이 노균병 발생 가능성이 증가합니다.",
    alarmOffsetDays: 3,
  },
  {
    region: "gochang",
    cropsAffected: ["감자"],
    type: "토양 병해",
    level: "경고",
    month: 8,
    day: 1,
    message: "토양 pH가 6.5를 초과해 감자 더뎅이병 위험이 상승합니다.",
    alarmOffsetDays: 7,
  },
  {
    region: "gochang",
    cropsAffected: ["감자"],
    type: "고온",
    level: "주의",
    month: 8,
    day: 25,
    message: "고온 지속으로 감자 괴경 비대가 저하될 수 있습니다.",
    alarmOffsetDays: 1,
  },
  {
    region: "jecheon-bongyang",
    cropsAffected: ["오이"],
    type: "저온",
    level: "주의",
    month: 4,
    day: 5,
    message: "야간 기온이 오이 정식 적정 범위보다 낮게 예상됩니다.",
    alarmOffsetDays: 1,
  },
  {
    region: "jecheon-bongyang",
    cropsAffected: ["상추"],
    type: "고온",
    level: "주의",
    month: 6,
    day: 15,
    message: "고온 지속으로 상추 추대(꽃대) 발생 위험이 있습니다.",
    alarmOffsetDays: 3,
  },
];

/** 오늘 이후로 가장 가까운 (month, day) 발생일 — 이미 지났으면 내년으로 넘긴다. */
export function toAbsoluteDate(event: RiskEvent): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  let date = new Date(year, event.month - 1, event.day);
  if (date.getTime() < today.getTime()) {
    date = new Date(year + 1, event.month - 1, event.day);
  }
  return date;
}

export function getRiskEventsForRegion(regionCode: string): RiskEvent[] {
  return RISK_EVENTS.filter((event) => event.region === regionCode);
}

export interface Report {
  regionCode: string;
  crop: CropId;
  summary: string;
  soilClimateExplainer: string;
  seasonalGuide: string;
  riskGuidance: string;
  disclaimer: string;
}

export const REPORT_DISCLAIMER =
  "필드핏이 제공하는 적합도 점수, 리포트, 위험 경고는 공개된 공공데이터와 표준 생육조건을 기반으로 한 참고용 정보이며, 실제 재배 결과(수확량, 병해 발생, 경제적 손실 등)를 보장하지 않습니다. 최종 재배 의사결정과 그에 따른 책임은 사용자 본인에게 있으며, 중요한 의사결정 전에는 지역 농업기술센터 등 전문가 상담을 병행할 것을 권장합니다.";

/**
 * 리포트 본문은 온도·토양 점수, 등급, 위험 유무에 따라 매번 다시 조립한다.
 * 이전에는 고창·제천 사과 리포트에 특정 점수(62점 등)를 그대로 문장에 박아
 * 뒀었는데, 점수가 이제 매월 다시 계산되므로 그 문장은 계산값과 어긋나는
 * 순간 거짓말이 된다 — 그래서 지역/작물별 손글씨 리포트 대신 항상 진단
 * 결과로부터 생성한다.
 */
function templatedReport(regionCode: string, crop: CropId, period: string): Report {
  const diagnosis = getRegionDiagnosis(regionCode, period);
  const entry = diagnosis.matrix.find((m) => m.crop === crop);
  const cropName = getCrop(crop)?.nameKo ?? crop;
  const standard = CROP_STANDARDS[crop];
  const score = entry?.score ?? 50;
  const grade = entry?.grade ?? gradeFromScore(score);
  const risks = entry?.risks ?? [];
  const tempScore = entry?.subScores.temperature ?? 50;
  const soilScore = entry?.subScores.soilPh ?? 50;
  const periodLabel = periodToKoreanLabel(diagnosis.period);

  const limitingFactor =
    tempScore < soilScore ? "온도" : soilScore < tempScore ? "토양" : "온도·토양 모두";

  return {
    regionCode,
    crop,
    summary: `${diagnosis.regionName} 기준 ${cropName} 적합도는 ${score}점(${grade})입니다. 온도 적합도 ${tempScore}점, 토양 적합도 ${soilScore}점으로, ${
      risks.length > 0
        ? `${limitingFactor} 조건이 점수를 끌어내린 주요 원인입니다.`
        : "두 조건 모두 양호합니다."
    }`,
    soilClimateExplainer: `토양 pH는 흙의 산성도를 나타내는 값으로, ${cropName}의 적정 범위는 ${standard.optimalPhMin}~${standard.optimalPhMax}입니다. 현재 지역 토양 pH는 ${diagnosis.envStat.soilPh}로 측정되었습니다. ${cropName}의 생육 적정온도는 ${standard.optimalTempMinC}~${standard.optimalTempMaxC}°C인데, ${periodLabel} 기준 예보 평균기온은 ${diagnosis.envStat.avgTempC}°C입니다.`,
    seasonalGuide:
      risks.length > 0
        ? `${periodLabel} 시점 기준으로 ${risks.map((r) => r.type).join("·")} 위험이 있어 시기 조정이나 대응 조치를 권장합니다. 위험 구간이 지난 뒤 정식하거나, 보온·차광 등 보호 조치를 함께 준비하는 것이 좋습니다.`
        : `${periodLabel} 시점 기준으로 큰 우려 요인은 없습니다. 다만 생육 기간 중 기온 변화는 위험 캘린더에서 계속 확인하는 것을 권장합니다.`,
    riskGuidance:
      risks.length > 0
        ? risks.map((r) => `${r.type} ${r.level}: ${r.description}`).join(" ")
        : "현재 등록된 위험 이벤트가 없습니다.",
    disclaimer: REPORT_DISCLAIMER,
  };
}

export function getReport(regionCode: string, crop: CropId, period: string): Report {
  return templatedReport(regionCode, crop, period);
}

export interface ChatQaPreset {
  label: string;
  sampleQuestion: string;
  keywords: string[];
  answer: string;
  sourceSection: string;
}

export const CHAT_QA_PRESETS: ChatQaPreset[] = [
  {
    label: "재배 적기",
    sampleQuestion: "지금 사과를 심어도 될까요?",
    keywords: ["지금 심어도", "지금 심어도 되나요", "심어도 되나요", "정식해도"],
    answer:
      "방금 확인하신 종합 적합도와 등급을 기준으로 판단하시면 됩니다. 저온이나 고온 위험이 리포트에 표시되어 있다면, 그 위험 구간이 지난 뒤 정식하는 것을 권장합니다.",
    sourceSection: "종합 진단 요약",
  },
  {
    label: "위험 시점",
    sampleQuestion: "언제가 제일 위험한가요?",
    keywords: ["언제가 제일 위험", "가장 위험한", "위험한가요", "위험 시점"],
    answer:
      "리포트의 '시기별 위험 경고 요약'에 표시된 시점이 가장 주의해야 할 구간입니다. 위험 캘린더의 알림 설정을 함께 활용하는 것을 권장합니다.",
    sourceSection: "시기별 위험 경고",
  },
  {
    label: "다른 작물 비교",
    sampleQuestion: "다른 작물은 어때요?",
    keywords: ["다른 작물", "다른 작물은 어때", "비교", "어떤 작물"],
    answer:
      "같은 지역·시기 기준 5작물 비교 매트릭스에서 순위가 더 높은 작물이 있는지 함께 확인해보세요. 한 작물만 보기보다 여러 작물을 비교해 결정하는 것을 권장합니다.",
    sourceSection: "5작물 비교 매트릭스",
  },
  {
    label: "점수 산출 근거",
    sampleQuestion: "이 점수는 어떻게 나온 건가요?",
    keywords: ["점수 근거", "근거가 뭐", "왜 이 점수", "점수 이유"],
    answer:
      "종합 점수는 온도 적합도×0.6 + 토양 적합도×0.4로 계산됩니다. 리포트에 표시된 두 세부 점수 중 더 낮은 쪽이 종합 점수를 끌어내린 주요 원인입니다.",
    sourceSection: "적합도 산출 근거",
  },
  {
    label: "재배 가이드",
    sampleQuestion: "재배 가이드를 알려주세요.",
    keywords: ["재배 가이드", "가이드 알려줘", "어떻게 키워"],
    answer:
      "리포트의 '시기별 재배 가이드' 섹션에 안내된 내용을 참고해주세요. 위험이 등록된 시기라면 그 구간을 피해 정식하는 것을 권장합니다.",
    sourceSection: "시기별 재배 가이드",
  },
];

export const CHAT_OUT_OF_SCOPE_QUESTION = "이 작물에 맞는 농약은 뭔가요?";

export const CHAT_OUT_OF_SCOPE_ANSWER =
  "이 질문은 본 서비스의 리포트 근거 범위를 벗어난 질문입니다. 병충해 방제 농약 처방 등 전문 상담이 필요한 내용은 지역 농업기술센터 등 전문가 상담을 권장합니다.";

export function matchChatAnswer(question: string): {
  answer: string;
  sourceSection?: string;
} {
  const normalized = question.trim();
  const matched = CHAT_QA_PRESETS.find((preset) =>
    preset.keywords.some((keyword) => normalized.includes(keyword)),
  );
  if (matched) {
    return { answer: matched.answer, sourceSection: matched.sourceSection };
  }
  return { answer: CHAT_OUT_OF_SCOPE_ANSWER };
}
