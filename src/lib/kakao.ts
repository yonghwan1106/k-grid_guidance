// Kakao Maps SDK 초기화 (프로토타입 모드)
export function initKakaoMaps() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined') {
      // 프로토타입 모드에서는 실제 Kakao Maps 로드 스킵
      console.log('프로토타입 모드: Kakao Maps 시뮬레이션')
      resolve()
      return
    }
    resolve()
  })
}

// 좌표를 주소로 변환 (프로토타입 모드)
export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  return new Promise((resolve) => {
    // 프로토타입 모드: 좌표 기반 서울 지역 주소 생성
    // 좌표를 기반으로 일관된 지역 선택
    const districtIndex = Math.floor((lat + lng) * 1000) % 25
    const districts = ['중구', '종로구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구']
    const selectedDistrict = districts[districtIndex]

    // 좌표를 기반으로 일관된 동/가 선택
    const dongIndex = Math.floor((lat * lng) * 1000) % 5
    const dongs = ['1가', '2가', '동', '가', '로']
    const selectedDong = dongs[dongIndex]

    // 상세 주소 생성 (번지수)
    const buildingNumber = Math.floor((lat * 1000) % 100) + 1

    resolve(`서울특별시 ${selectedDistrict} ${selectedDong} ${buildingNumber}`)
  })
}

// 주소를 좌표로 변환 (프로토타입 모드)
export async function getCoordsFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    // 프로토타입 모드: 서울 시내 랜덤 좌표 생성
    const lat = 37.5 + Math.random() * 0.1 // 37.5 ~ 37.6
    const lng = 126.9 + Math.random() * 0.2 // 126.9 ~ 127.1

    resolve({ lat, lng })
  })
}

// 현재 위치 가져오기 (프로토타입 모드)
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    // 프로토타입 모드: 서울시청 근처 좌표 반환
    console.log('프로토타입 모드: 가상 위치 정보 사용')
    resolve({
      lat: 37.5665 + (Math.random() - 0.5) * 0.01, // 서울시청 근처
      lng: 126.9780 + (Math.random() - 0.5) * 0.01
    })
  })
}

// 두 좌표 간 거리 계산 (미터)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// TypeScript용 Kakao Maps 타입 선언
declare global {
  interface Window {
    kakao: any
  }
}