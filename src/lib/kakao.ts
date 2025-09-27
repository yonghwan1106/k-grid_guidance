// Kakao Maps SDK 초기화
export function initKakaoMaps() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined') {
      if (window.kakao && window.kakao.maps) {
        console.log('Kakao Maps SDK 이미 로드됨')
        resolve()
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY
      if (!apiKey) {
        console.error('Kakao API key가 설정되지 않았습니다')
        reject(new Error('Kakao API key not found'))
        return
      }

      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log('Kakao Maps SDK 로드 완료')
          resolve()
        })
      }
      script.onerror = () => {
        console.error('Kakao Maps SDK 로드 실패')
        reject(new Error('Failed to load Kakao Maps SDK'))
      }
      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
}

// 좌표를 주소로 변환
export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps) {
      // 서버 사이드나 Kakao SDK가 없을 때 기본 주소 반환
      resolve(`좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      return
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0]?.address
          if (address) {
            const fullAddress = address.address_name ||
              `${address.region_1depth_name || ''} ${address.region_2depth_name || ''} ${address.region_3depth_name || ''}`.trim()
            resolve(fullAddress)
          } else {
            resolve(`좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        } else {
          console.warn('주소 변환 실패, 좌표 표시:', status)
          resolve(`좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      })
    } catch (error) {
      console.error('주소 변환 중 오류:', error)
      resolve(`좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
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

// 현재 위치 가져오기
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('GPS를 지원하지 않는 브라우저, 기본 위치 사용')
      resolve({
        lat: 37.5665, // 서울시청
        lng: 126.9780
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS 위치 정보 획득 성공')
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.warn('GPS 위치 정보 획득 실패:', error.message)
        console.log('기본 위치 사용 (서울시청)')
        // GPS 실패 시 서울시청 좌표 사용
        resolve({
          lat: 37.5665,
          lng: 126.9780
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10분간 캐시 허용
      }
    )
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