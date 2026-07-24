# FieldFit (필드핏)

귀농인 맞춤형 작물 재배 가이드 서비스. 기획 문서는 `docs/필드핏_통합기획문서.md` 참고.

## 개발 환경

- Next.js 16 (App Router) + TypeScript + Tailwind CSS + ESLint

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

환경변수가 필요하면 `.env.example`을 복사해 `.env.local`로 만들고 값을 채우세요.

```bash
cp .env.example .env.local
```
