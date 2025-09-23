import { UserLevel } from '@/types'

// 사용자 레벨 시스템
export const USER_LEVELS: UserLevel[] = [
  { level: 1, name: '신입 가디언', threshold: 0, color: '#6B7280' },
  { level: 2, name: '열심 가디언', threshold: 1000, color: '#059669' },
  { level: 3, name: '베테랑 가디언', threshold: 5000, color: '#2563EB' },
  { level: 4, name: '엘리트 가디언', threshold: 15000, color: '#7C3AED' },
  { level: 5, name: '전설 가디언', threshold: 50000, color: '#DC2626' },
]

// 포인트 시스템
export const POINTS = {
  SAFETY_REPORT: {
    BASE: 100,
    MULTIPLIER_BY_RISK: {
      LOW: 1, // 1-3점
      MEDIUM: 2, // 4-6점
      HIGH: 5, // 7-10점
    }
  },
  ENERGY_SAVING: {
    PER_KWH: 10,
  },
  DAILY_BONUS: 20,
  QUEST_COMPLETION: {
    EASY: 200,
    MEDIUM: 500,
    HARD: 1000,
  },
  FIRST_ACTION: 50,
  STREAK_BONUS: {
    WEEK: 100,
    MONTH: 500,
  }
} as const

// 배지 정의
export const BADGES = {
  FIRST_REPORT: {
    id: 'first_report',
    name: '첫 신고 완수',
    description: '첫 번째 안전 신고를 완료했습니다',
    iconUrl: '/badges/first-report.svg'
  },
  PEAK_DESTROYER: {
    id: 'peak_destroyer',
    name: '피크전력 파괴자',
    description: '피크 시간 전력 사용량을 50% 이상 줄였습니다',
    iconUrl: '/badges/peak-destroyer.svg'
  },
  ENERGY_SAVER: {
    id: 'energy_saver',
    name: '에너지 절약왕',
    description: '월간 100kWh 이상 절약했습니다',
    iconUrl: '/badges/energy-saver.svg'
  },
  NEIGHBORHOOD_HERO: {
    id: 'neighborhood_hero',
    name: '우리 동네 영웅',
    description: '우리 동네에서 가장 많은 신고를 했습니다',
    iconUrl: '/badges/neighborhood-hero.svg'
  },
  STREAK_WARRIOR: {
    id: 'streak_warrior',
    name: '7일 연속 참여',
    description: '7일 연속으로 미션을 수행했습니다',
    iconUrl: '/badges/streak-warrior.svg'
  }
} as const

// 위험도 분류
export const RISK_LEVELS = {
  LOW: { min: 1, max: 3, color: '#22C55E', label: '낮음' },
  MEDIUM: { min: 4, max: 6, color: '#F59E0B', label: '보통' },
  HIGH: { min: 7, max: 10, color: '#EF4444', label: '높음' }
} as const

// 안전 신고 카테고리
export const SAFETY_CATEGORIES = {
  tilting: {
    id: 'tilting',
    name: '기울어짐',
    description: '전신주나 철탑이 기울어진 상태',
    icon: '⚠️',
    color: '#F59E0B'
  },
  tree_contact: {
    id: 'tree_contact',
    name: '수목접촉',
    description: '나뭇가지가 전선에 닿거나 가까운 상태',
    icon: '🌳',
    color: '#059669'
  },
  equipment_damage: {
    id: 'equipment_damage',
    name: '설비파손',
    description: '전력설비가 손상되거나 파손된 상태',
    icon: '🔧',
    color: '#DC2626'
  },
  other: {
    id: 'other',
    name: '기타',
    description: '기타 전력설비 관련 위험요소',
    icon: '❓',
    color: '#6B7280'
  }
} as const

// 미션 타입별 설정
export const MISSION_CONFIGS = {
  peak_reduction: {
    name: '피크시간 사용량 감소',
    description: '19-21시 전력 사용량을 줄이세요',
    icon: '📉',
    color: '#EF4444',
    unit: '%',
    defaultTarget: 20
  },
  standby_power: {
    name: '대기전력 차단',
    description: '사용하지 않는 전자기기의 플러그를 뽑으세요',
    icon: '🔌',
    color: '#059669',
    unit: 'kWh',
    defaultTarget: 5
  },
  monthly_savings: {
    name: '월간 에너지 절약',
    description: '전월 대비 전력 사용량을 줄이세요',
    icon: '📊',
    color: '#2563EB',
    unit: '%',
    defaultTarget: 10
  },
  continuous_participation: {
    name: '연속 참여',
    description: '매일 미션에 참여하세요',
    icon: '🔥',
    color: '#F59E0B',
    unit: '일',
    defaultTarget: 7
  }
} as const

// 시간대별 전력 요금 (예시)
export const ELECTRICITY_RATES = {
  PEAK: { start: 19, end: 21, rate: 0.15 }, // 19-21시 피크
  MID: { start: 9, end: 19, rate: 0.10 }, // 9-19시 중간
  OFF_PEAK: { start: 21, end: 9, rate: 0.06 } // 21-9시 경부하
} as const

// 앱 설정
export const APP_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  API_TIMEOUT: 3000, // 3초
  LOCATION_ACCURACY: 10, // 10m
  NOTIFICATION_SETTINGS: {
    MISSION_REMINDER: true,
    REPORT_UPDATE: true,
    BADGE_EARNED: true,
    TEAM_ACTIVITY: true
  }
} as const