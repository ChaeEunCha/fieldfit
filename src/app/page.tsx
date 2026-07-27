import Link from "next/link";
import { BrandMark, Button, Card } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-10 px-6 py-14">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5">
          <BrandMark size={40} />
          <span className="text-lg font-extrabold text-brand-deep">
            FieldFit
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-extrabold leading-snug text-ink">
            표준 매뉴얼과 내 땅 사이,
            <br />그 정보 격차를 채웁니다
          </h1>
          <p className="text-[14.5px] leading-relaxed text-muted">
            &ldquo;사과는 15~25°C&rdquo;라는 전국 공통 매뉴얼만으로는 내 지역의
            저온·토양 리스크를 알 수 없습니다. 필드핏은 공공 기상·토양 데이터를
            내 땅 기준으로 계산해, 지금 이 작물을 심어도 되는지 알려드립니다.
          </p>
        </div>

        <Card className="flex flex-col gap-3">
          <div className="text-[13px] font-bold text-ink">이렇게 진단해요</div>
          <ul className="flex flex-col gap-2 text-[12.5px] text-muted">
            <li>1. 재배 예정 지역·작물·시기 입력</li>
            <li>2. 기상·토양 공공데이터 자동 조회</li>
            <li>3. 5작물 환경 적합도 점수·위험 확인</li>
            <li>4. 위험 캘린더 알림 등록</li>
          </ul>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/onboarding">
          <Button variant="primary" className="w-full">
            진단 시작하기
          </Button>
        </Link>
        <Link href="/home">
          <Button variant="outline" className="w-full">
            대시보드 둘러보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
