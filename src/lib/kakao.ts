// Kakao Maps SDK 초기화
export function initKakaoMaps() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined') {
      // 이미 로드되어 있으면 바로 resolve
      if (window.kakao && window.kakao.maps) {
        resolve()
        return
      }

      // 스크립트 동적 로드
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`
      script.async = true

      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve()
        })
      }

      script.onerror = () => {
        reject(new Error('Kakao Maps SDK 로드 실패'))
      }

      document.head.appendChild(script)
    }
  })
}

// 좌표를 주소로 변환
export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Kakao API 호출 실패')
    }

    const data = await response.json()

    if (data.documents && data.documents.length > 0) {
      const address = data.documents[0].address
      if (address) {
        return `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`
      }

      // road_address가 있으면 사용
      const roadAddress = data.documents[0].road_address
      if (roadAddress) {
        return roadAddress.address_name
      }
    }

    throw new Error('주소를 찾을 수 없습니다')
  } catch (error) {
    console.error('주소 변환 실패:', error)
    // 폴백: 좌표 정보 반환
    return `위도 ${lat.toFixed(6)}, 경도 ${lng.toFixed(6)}`
  }
}

// 주소를 좌표로 변환
export async function getCoordsFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Kakao API 호출 실패')
    }

    const data = await response.json()

    if (data.documents && data.documents.length > 0) {
      const doc = data.documents[0]
      return {
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x)
      }
    }

    return null
  } catch (error) {
    console.error('좌표 변환 실패:', error)
    return null
  }
}

// 현재 위치 가져오기 (브라우저 Geolocation API)
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않습니다'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
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