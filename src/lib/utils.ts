import { type ClassValue, clsx } from 'clsx'
import { RISK_LEVELS, USER_LEVELS } from './constants'

// CSS 클래스 조합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// 위험도에 따른 색상 반환
export function getRiskColor(riskScore: number): string {
  if (riskScore <= RISK_LEVELS.LOW.max) return RISK_LEVELS.LOW.color
  if (riskScore <= RISK_LEVELS.MEDIUM.max) return RISK_LEVELS.MEDIUM.color
  return RISK_LEVELS.HIGH.color
}

// 위험도에 따른 라벨 반환
export function getRiskLabel(riskScore: number): string {
  if (riskScore <= RISK_LEVELS.LOW.max) return RISK_LEVELS.LOW.label
  if (riskScore <= RISK_LEVELS.MEDIUM.max) return RISK_LEVELS.MEDIUM.label
  return RISK_LEVELS.HIGH.label
}

// 포인트에 따른 사용자 레벨 계산
export function calculateUserLevel(points: number) {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (points >= USER_LEVELS[i].threshold) {
      return USER_LEVELS[i]
    }
  }
  return USER_LEVELS[0]
}

// 다음 레벨까지 필요한 포인트 계산
export function getPointsToNextLevel(points: number): number {
  const currentLevel = calculateUserLevel(points)
  const nextLevelIndex = USER_LEVELS.findIndex(level => level.level === currentLevel.level) + 1

  if (nextLevelIndex >= USER_LEVELS.length) {
    return 0 // 최고 레벨
  }

  return USER_LEVELS[nextLevelIndex].threshold - points
}

// 레벨 진행률 계산 (0-100)
export function getLevelProgress(points: number): number {
  const currentLevel = calculateUserLevel(points)
  const currentLevelIndex = USER_LEVELS.findIndex(level => level.level === currentLevel.level)
  const nextLevelIndex = currentLevelIndex + 1

  if (nextLevelIndex >= USER_LEVELS.length) {
    return 100 // 최고 레벨
  }

  const currentThreshold = USER_LEVELS[currentLevelIndex].threshold
  const nextThreshold = USER_LEVELS[nextLevelIndex].threshold
  const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100

  return Math.min(100, Math.max(0, progress))
}

// 날짜 포맷팅
export function formatDate(date: Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 상대적 시간 표시 (1주일 이내)
  if (days < 7) {
    if (seconds < 60) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days === 1) return '어제'
    return `${days}일 전`
  }

  // 절대적 시간 표시
  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : format === 'time'
      ? { hour: '2-digit', minute: '2-digit' }
      : { month: 'numeric', day: 'numeric' }

  return date.toLocaleDateString('ko-KR', options)
}

// 숫자 포맷팅 (천 단위 콤마)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

// 에너지 단위 포맷팅
export function formatEnergy(value: number, unit: 'Wh' | 'kWh' | 'MWh' = 'kWh'): string {
  const formatValue = (val: number) => Math.round(val * 100) / 100

  switch (unit) {
    case 'Wh':
      if (value >= 1000000) return `${formatValue(value / 1000000)}MWh`
      if (value >= 1000) return `${formatValue(value / 1000)}kWh`
      return `${formatValue(value)}Wh`
    case 'kWh':
      if (value >= 1000) return `${formatValue(value / 1000)}MWh`
      return `${formatValue(value)}kWh`
    case 'MWh':
      return `${formatValue(value)}MWh`
    default:
      return `${formatValue(value)}${unit}`
  }
}

// 이미지 압축
export function compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const maxWidth = 1200
      const maxHeight = 1200
      let { width, height } = img

      // 비율 유지하면서 크기 조정
      if (width > height && width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      } else if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('이미지 압축에 실패했습니다'))
          }
        },
        'image/jpeg',
        0.8
      )
    }

    img.onerror = () => reject(new Error('이미지 로드에 실패했습니다'))
    img.src = URL.createObjectURL(file)
  })
}

// GPS 좌표를 주소로 변환 (Kakao API)
export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  // kakao.ts에서 실제 구현을 import
  const { getAddressFromCoords: kakaoGetAddress } = await import('./kakao')
  return kakaoGetAddress(lat, lng)
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

// 디바운스 함수
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}