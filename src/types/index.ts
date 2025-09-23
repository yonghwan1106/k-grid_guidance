// 사용자 관련 타입
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  level: number
  points: number
  badges: Badge[]
  location: {
    lat: number
    lng: number
    address: string
  }
  createdAt: Date
  lastActiveAt: Date
}

// 게이미피케이션 관련 타입
export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  unlockedAt: Date
}

export interface UserLevel {
  level: number
  name: string
  threshold: number
  color: string
}

// 안전 신고 관련 타입
export interface SafetyReport {
  id: string
  userId: string
  location: {
    lat: number
    lng: number
    address: string
  }
  category: SafetyCategory
  imageUrl: string
  description: string
  riskScore: number // 1-10
  urgency: 'low' | 'medium' | 'high'
  status: ReportStatus
  aiAnalysis: {
    description: string
    recommendedAction: string
    confidence: number
  }
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export type SafetyCategory =
  | 'tilting' // 기울어짐
  | 'tree_contact' // 수목접촉
  | 'equipment_damage' // 설비파손
  | 'other' // 기타

export type ReportStatus =
  | 'submitted' // 신고됨
  | 'received' // 접수됨
  | 'in_progress' // 처리중
  | 'resolved' // 해결됨
  | 'rejected' // 반려됨

// 에너지 관련 타입
export interface EnergyMission {
  id: string
  userId: string
  title: string
  description: string
  type: MissionType
  targetValue: number
  currentValue: number
  unit: string
  startDate: Date
  endDate: Date
  status: MissionStatus
  rewards: {
    points: number
    badges?: string[]
  }
  difficulty: 'easy' | 'medium' | 'hard'
}

export type MissionType =
  | 'peak_reduction' // 피크시간 사용량 감소
  | 'standby_power' // 대기전력 차단
  | 'monthly_savings' // 월간 절약
  | 'continuous_participation' // 연속 참여

export type MissionStatus =
  | 'active' // 진행중
  | 'completed' // 완료
  | 'failed' // 실패
  | 'paused' // 일시정지

export interface EnergyUsage {
  userId: string
  date: Date
  hourlyUsage: number[] // 24시간 배열
  totalDaily: number
  peakUsage: number
  peakHours: number[]
  cost: number
}

// 커뮤니티 관련 타입
export interface CommunityPost {
  id: string
  userId: string
  type: 'report_share' | 'mission_success' | 'tip_share' | 'question'
  title: string
  content: string
  imageUrls?: string[]
  relatedReportId?: string
  relatedMissionId?: string
  likes: number
  comments: Comment[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  userId: string
  content: string
  likes: number
  createdAt: Date
}

// 팀 미션 관련 타입
export interface TeamMission {
  id: string
  name: string
  description: string
  memberIds: string[]
  targetValue: number
  currentValue: number
  unit: string
  startDate: Date
  endDate: Date
  status: MissionStatus
  rewards: {
    pointsPerMember: number
    teamBadge?: string
  }
  leaderboardType: 'apartment' | 'neighborhood' | 'city'
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 지도 관련 타입
export interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  type: 'safety_report' | 'resolved_issue' | 'team_mission'
  data: SafetyReport | TeamMission
  color: string
}

// 알림 관련 타입
export interface Notification {
  id: string
  userId: string
  type: 'mission_complete' | 'badge_earned' | 'report_update' | 'team_invite'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: Date
}