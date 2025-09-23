# K-그리드 가디언즈

게이미피케이션 기반 시민참여 전력망 안전·효율 플랫폼

## 🚀 프로젝트 개요

K-그리드 가디언즈는 시민들이 게임 요소를 통해 즐겁게 참여할 수 있는 전력망 안전 및 에너지 효율 플랫폼입니다. AI 분석을 통한 안전 신고, 개인화된 에너지 절약 미션, 그리고 활발한 커뮤니티를 통해 안전하고 효율적인 에너지 미래를 만들어갑니다.

## ✨ 주요 기능

### 1. 그리드 워치 (Grid Watch) 📸
- **AI 기반 위험도 분석**: Claude API를 통한 실시간 위험도 평가
- **자동 GPS 태깅**: 정확한 위치 정보 자동 수집
- **실시간 처리 현황**: 신고부터 해결까지 전 과정 추적
- **포인트 보상**: 위험도에 따른 차등 포인트 지급

### 2. 세이버 퀘스트 (Saver Quest) ⚡
- **개인화된 미션**: AI 기반 맞춤형 에너지 절약 미션
- **실시간 모니터링**: 시간대별 에너지 사용량 추적
- **인증 시스템**: 사진 인증을 통한 미션 완료 검증
- **절약 효과 분석**: 상세한 에너지 절약 리포트

### 3. 게이미피케이션 엔진 🏆
- **레벨 시스템**: 5단계 가디언 레벨 (신입 → 전설)
- **배지 컬렉션**: 다양한 성취 배지 수집
- **포인트 시스템**: 활동별 차등 포인트 적립
- **리더보드**: 전국/지역/동네 단위 순위 경쟁

### 4. 커뮤니티 플랫폼 👥
- **소셜 피드**: 신고 공유, 미션 성공, 팁 공유, Q&A
- **실시간 댓글**: 이웃과의 소통 및 정보 교환
- **팀 미션**: 아파트/마을 단위 공동 목표 도전
- **지역 기반**: 위치 기반 지역 커뮤니티

## 🛠 기술 스택

```
Frontend: Next.js 14 + React + TypeScript
UI/UX: Tailwind CSS + Framer Motion
State: Zustand + React Query
Maps: Kakao Maps API
AI: Claude API (Anthropic)
Backend: Vercel Edge Functions
Database: Supabase PostgreSQL
Analytics: Vercel Analytics
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   ├── providers.tsx      # 글로벌 프로바이더
│   ├── safety/            # 안전 미션 페이지
│   ├── energy/            # 에너지 미션 페이지
│   ├── community/         # 커뮤니티 페이지
│   └── profile/           # 프로필 페이지
├── components/            # 재사용 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── safety/            # 안전 관련 컴포넌트
│   ├── energy/            # 에너지 관련 컴포넌트
│   ├── gamification/      # 게이미피케이션 컴포넌트
│   ├── community/         # 커뮤니티 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── api/               # API 함수들
│   ├── constants.ts       # 상수 정의
│   └── utils.ts           # 유틸리티 함수
├── stores/                # Zustand 상태 관리
├── types/                 # TypeScript 타입 정의
└── hooks/                 # 커스텀 훅
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 확인

[http://localhost:3000](http://localhost:3000)

## 📱 주요 사용자 여정

### 신규 사용자의 첫 신고
1. **문제 발견** → 기울어진 전신주 발견
2. **앱 접속** → PWA 링크를 통한 간편 접속
3. **간단 가입** → 소셜 로그인으로 30초 가입
4. **사진 촬영** → 자동 GPS 태깅
5. **AI 분석** → 3초 내 위험도 8/10 분석
6. **보상 획득** → 200P + "첫 신고 완수" 배지

### 에너지 절약 미션
1. **맞춤 미션** → "피크시간 사용량 20% 감소"
2. **실행 인증** → 에어컨 설정 사진 업로드
3. **실시간 추적** → 에너지 사용량 그래프
4. **미션 완료** → 300P + 성실 참여 보너스
5. **성과 공유** → 커뮤니티에 성공 경험 공유

## 🎯 핵심 성공 지표 (KPIs)

- **일간 활성 사용자**: 목표 5,000명
- **월간 활성 사용자**: 목표 50,000명
- **신고 완료율**: 80% 이상
- **에너지 절약 미션 성공률**: 65% 이상
- **총 에너지 절약량**: 월간 100MWh
- **안전 위험 요소 발견**: 월간 500건

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Blue (#2563EB) - 신뢰감과 안정성
- **Success**: Green (#22C55E) - 성공과 효율성
- **Warning**: Yellow (#F59E0B) - 주의와 경고
- **Danger**: Red (#EF4444) - 위험과 긴급상황

### 타이포그래피
- **폰트**: Pretendard (한글 최적화)
- **크기**: 4가지 레벨 (sm, md, lg, xl)

## 🔒 보안 고려사항

- **개인정보 보호**: GPS 위치 익명화 처리
- **이미지 보안**: 업로드 이미지 메타데이터 자동 제거
- **데이터 암호화**: 민감 정보 AES-256 암호화

## 🌐 브라우저 지원

- Chrome 90+
- Safari 14+
- Edge 90+
- Firefox 88+

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

- 프로젝트 링크: [https://github.com/your-username/k-grid-guardians](https://github.com/your-username/k-grid-guardians)
- 이슈 신고: [Issues](https://github.com/your-username/k-grid-guardians/issues)

---

**K-그리드 가디언즈와 함께 안전하고 효율적인 에너지 미래를 만들어가세요! 🚀**