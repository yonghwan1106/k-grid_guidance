# 🚀 K-그리드 가디언즈 설치 및 API 설정 가이드

## 📋 사전 준비사항

### 1. Node.js 설치
- Node.js 18.0 이상 필요
- [Node.js 공식 사이트](https://nodejs.org/)에서 다운로드

### 2. 필요한 API 키 준비

#### Claude API (Anthropic)
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 및 로그인
3. API Keys 메뉴에서 새 API 키 생성
4. 키를 안전한 곳에 복사해두기

#### Kakao Maps API
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션" → "애플리케이션 추가하기"
4. 앱 이름: "K-그리드 가디언즈" (또는 원하는 이름)
5. 회사명: 개인 또는 회사명 입력
6. 생성 후 "앱 키" 탭에서 "JavaScript 키" 복사

## 🔧 설치 과정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd k-grid_guidance

# 의존성 설치
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 편집하여 실제 API 키를 입력하세요:

```bash
# Claude API Key (Anthropic)
CLAUDE_API_KEY=sk-ant-api03-your-actual-claude-api-key-here

# Kakao Maps API Key
NEXT_PUBLIC_KAKAO_API_KEY=your-actual-kakao-javascript-key-here

# 선택사항: Supabase (데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Kakao Maps 도메인 설정

Kakao Developers Console에서:
1. 생성한 앱 선택
2. "플랫폼" 탭 이동
3. "Web 플랫폼 등록" 클릭
4. 도메인 추가:
   - 개발용: `http://localhost:3000`
   - 배포용: 실제 도메인 주소

## 🚀 실행

### 개발 서버 시작

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## ✅ 기능 테스트

### 1. Claude API 테스트
1. "그리드 워치" 메뉴 접속
2. "새 신고" 버튼 클릭
3. 사진 업로드 및 위험 카테고리 선택
4. "AI 분석 요청하기" 클릭
5. 실제 AI 분석 결과 확인 (2-3초 소요)

### 2. Kakao Maps API 테스트
1. "지역 현황" 메뉴 접속
2. 지도가 정상적으로 로드되는지 확인
3. 위치 허용 시 현재 위치로 지도 중심 이동
4. 신고 폼에서 "현재 위치 가져오기" 버튼 테스트

## 🔧 문제 해결

### Claude API 오류
```
Error: 401 Unauthorized
```
- API 키가 올바른지 확인
- `.env.local` 파일이 루트 디렉토리에 있는지 확인
- 개발 서버 재시작 (`npm run dev`)

### Kakao Maps 오류
```
Error: InvalidKey
```
- JavaScript 키를 사용했는지 확인 (REST API 키 아님)
- 도메인이 등록되어 있는지 확인
- `NEXT_PUBLIC_` 접두사가 있는지 확인

### 위치 정보 오류
```
GeolocationPositionError
```
- HTTPS 환경에서 테스트 (localhost는 HTTP 허용)
- 브라우저에서 위치 정보 허용
- 다른 브라우저에서 테스트

## 📱 모바일 테스트

### PWA 테스트
1. Chrome 모바일에서 사이트 접속
2. "홈 화면에 추가" 옵션 확인
3. 오프라인 상태에서 기본 기능 동작 확인

### 위치 기반 기능
1. 모바일에서 "현재 위치 가져오기" 테스트
2. GPS 정확도 확인
3. 지도에서 마커 표시 확인

## 🎯 성능 최적화

### 이미지 최적화
- 자동 이미지 압축 (최대 5MB → 1MB 이하)
- WebP 형식 지원
- 반응형 이미지 로딩

### API 최적화
- Claude API 응답 캐싱 (선택사항)
- 지도 마커 클러스터링 (대량 데이터용)
- 무한 스크롤 구현

## 🚀 배포 가이드

### Vercel 배포 (권장)
1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 연동
3. 환경변수 설정
4. 자동 배포 확인

### 환경변수 설정 (Vercel)
```
CLAUDE_API_KEY=your-claude-api-key
NEXT_PUBLIC_KAKAO_API_KEY=your-kakao-key
```

## 📞 지원

### 문제 신고
- GitHub Issues: [프로젝트 Issues](https://github.com/your-repo/issues)
- 이메일: support@k-grid-guardians.com

### API 문서
- [Claude API 문서](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Kakao Maps API 문서](https://apis.map.kakao.com/web/)

---

🎉 **설정 완료! K-그리드 가디언즈와 함께 안전한 전력망을 만들어가세요!**