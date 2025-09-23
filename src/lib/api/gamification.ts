import { User, Badge, ApiResponse } from '@/types'
import { BADGES, POINTS, USER_LEVELS } from '@/lib/constants'
import { calculateUserLevel } from '@/lib/utils'

// 포인트 적립
export async function earnPoints(
  userId: string,
  points: number,
  reason: string
): Promise<ApiResponse<{
  newPoints: number
  earnedBadges: Badge[]
  levelUp: boolean
  newLevel?: typeof USER_LEVELS[0]
}>> {
  try {
    // 실제로는 데이터베이스에서 사용자 정보 조회
    const user = await getUserFromDatabase(userId)
    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }
    }

    const oldLevel = calculateUserLevel(user.points)
    const newPoints = user.points + points
    const newLevel = calculateUserLevel(newPoints)
    const levelUp = newLevel.level > oldLevel.level

    // 새로 획득한 배지 확인
    const earnedBadges = await checkForNewBadges(userId, newPoints, reason)

    // 사용자 포인트 업데이트
    await updateUserPoints(userId, newPoints)

    // 포인트 획득 이력 저장
    await savePointsHistory(userId, points, reason)

    return {
      success: true,
      data: {
        newPoints,
        earnedBadges,
        levelUp,
        newLevel: levelUp ? newLevel : undefined
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '포인트 적립 중 오류가 발생했습니다.'
    }
  }
}

// 배지 획득 확인
export async function checkForNewBadges(
  userId: string,
  totalPoints: number,
  lastAction: string
): Promise<Badge[]> {
  const earnedBadges: Badge[] = []
  const userBadges = await getUserBadges(userId)
  const existingBadgeIds = new Set(userBadges.map(b => b.id))

  // 첫 신고 완수 배지
  if (!existingBadgeIds.has(BADGES.FIRST_REPORT.id) && lastAction.includes('첫 신고')) {
    const badge = await awardBadge(userId, BADGES.FIRST_REPORT.id)
    if (badge) earnedBadges.push(badge)
  }

  // 에너지 절약왕 배지 (월간 100kWh 절약)
  if (!existingBadgeIds.has(BADGES.ENERGY_SAVER.id) && lastAction.includes('월간 절약')) {
    const monthlySavings = await getMonthlySavings(userId)
    if (monthlySavings >= 100) {
      const badge = await awardBadge(userId, BADGES.ENERGY_SAVER.id)
      if (badge) earnedBadges.push(badge)
    }
  }

  // 피크전력 파괴자 배지
  if (!existingBadgeIds.has(BADGES.PEAK_DESTROYER.id) && lastAction.includes('피크 감소')) {
    const badge = await awardBadge(userId, BADGES.PEAK_DESTROYER.id)
    if (badge) earnedBadges.push(badge)
  }

  // 연속 참여 배지
  if (!existingBadgeIds.has(BADGES.STREAK_WARRIOR.id)) {
    const consecutiveDays = await getConsecutiveParticipationDays(userId)
    if (consecutiveDays >= 7) {
      const badge = await awardBadge(userId, BADGES.STREAK_WARRIOR.id)
      if (badge) earnedBadges.push(badge)
    }
  }

  // 우리 동네 영웅 배지 (지역 1위)
  if (!existingBadgeIds.has(BADGES.NEIGHBORHOOD_HERO.id)) {
    const isLocalLeader = await checkLocalLeadership(userId)
    if (isLocalLeader) {
      const badge = await awardBadge(userId, BADGES.NEIGHBORHOOD_HERO.id)
      if (badge) earnedBadges.push(badge)
    }
  }

  return earnedBadges
}

// 리더보드 조회
export async function getLeaderboard(
  type: 'national' | 'regional' | 'local',
  userId?: string
): Promise<ApiResponse<{
  entries: Array<User & { rank: number; weeklyPoints: number }>
  userRank?: number
}>> {
  try {
    // 실제로는 데이터베이스에서 조회하고 정렬
    const mockData = generateMockLeaderboard(type, 50)

    let userRank: number | undefined
    if (userId) {
      const userEntry = mockData.find(entry => entry.id === userId)
      userRank = userEntry?.rank
    }

    return {
      success: true,
      data: {
        entries: mockData.slice(0, 20), // 상위 20명만 반환
        userRank
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '리더보드를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 사용자 배지 목록 조회
export async function getUserBadges(userId: string): Promise<Badge[]> {
  // 실제로는 데이터베이스에서 조회
  return generateMockUserBadges(userId)
}

// 사용자 통계 조회
export async function getUserStats(userId: string): Promise<ApiResponse<{
  totalPoints: number
  level: typeof USER_LEVELS[0]
  badgeCount: number
  weeklyPoints: number
  monthlyPoints: number
  rank: {
    national: number
    regional: number
    local: number
  }
  achievements: {
    reportsSubmitted: number
    energySaved: number // kWh
    consecutiveDays: number
    missionsCompleted: number
  }
}>> {
  try {
    const user = await getUserFromDatabase(userId)
    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }
    }

    const level = calculateUserLevel(user.points)
    const badges = await getUserBadges(userId)
    const weeklyPoints = await getWeeklyPoints(userId)
    const monthlyPoints = await getMonthlyPoints(userId)

    // 랭킹 조회
    const nationalRank = await getUserRank(userId, 'national')
    const regionalRank = await getUserRank(userId, 'regional')
    const localRank = await getUserRank(userId, 'local')

    // 성취 통계
    const achievements = await getUserAchievements(userId)

    return {
      success: true,
      data: {
        totalPoints: user.points,
        level,
        badgeCount: badges.length,
        weeklyPoints,
        monthlyPoints,
        rank: {
          national: nationalRank,
          regional: regionalRank,
          local: localRank
        },
        achievements
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '사용자 통계를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 유틸리티 함수들
async function getUserFromDatabase(userId: string): Promise<User | null> {
  // 실제로는 데이터베이스에서 조회
  return generateMockUser(userId)
}

async function updateUserPoints(userId: string, points: number): Promise<void> {
  // 실제로는 데이터베이스 업데이트
  console.log(`Updating user ${userId} points to ${points}`)
}

async function savePointsHistory(userId: string, points: number, reason: string): Promise<void> {
  // 실제로는 포인트 획득 이력을 데이터베이스에 저장
  console.log(`User ${userId} earned ${points} points for: ${reason}`)
}

async function awardBadge(userId: string, badgeId: string): Promise<Badge | null> {
  const badgeConfig = Object.values(BADGES).find(b => b.id === badgeId)
  if (!badgeConfig) return null

  const badge: Badge = {
    id: badgeConfig.id,
    name: badgeConfig.name,
    description: badgeConfig.description,
    iconUrl: badgeConfig.iconUrl,
    unlockedAt: new Date()
  }

  // 실제로는 데이터베이스에 저장
  console.log(`Awarding badge ${badgeId} to user ${userId}`)

  return badge
}

async function getMonthlySavings(userId: string): Promise<number> {
  // 실제로는 월간 에너지 절약량 계산
  return Math.random() * 150 // 0-150 kWh
}

async function getConsecutiveParticipationDays(userId: string): Promise<number> {
  // 실제로는 연속 참여 일수 계산
  return Math.floor(Math.random() * 14) // 0-14일
}

async function checkLocalLeadership(userId: string): Promise<boolean> {
  // 실제로는 지역 내 순위 확인
  return Math.random() > 0.9 // 10% 확률
}

async function getWeeklyPoints(userId: string): Promise<number> {
  return Math.floor(Math.random() * 1000)
}

async function getMonthlyPoints(userId: string): Promise<number> {
  return Math.floor(Math.random() * 5000)
}

async function getUserRank(userId: string, type: 'national' | 'regional' | 'local'): Promise<number> {
  const maxRank = type === 'national' ? 100000 : type === 'regional' ? 10000 : 1000
  return Math.floor(Math.random() * maxRank) + 1
}

async function getUserAchievements(userId: string): Promise<{
  reportsSubmitted: number
  energySaved: number
  consecutiveDays: number
  missionsCompleted: number
}> {
  return {
    reportsSubmitted: Math.floor(Math.random() * 50),
    energySaved: Math.floor(Math.random() * 500),
    consecutiveDays: Math.floor(Math.random() * 30),
    missionsCompleted: Math.floor(Math.random() * 20)
  }
}

// 모의 데이터 생성 함수들
function generateMockUser(userId: string): User {
  return {
    id: userId,
    name: `사용자${userId.slice(-4)}`,
    email: `user${userId.slice(-4)}@example.com`,
    level: Math.floor(Math.random() * 5) + 1,
    points: Math.floor(Math.random() * 50000),
    badges: generateMockUserBadges(userId),
    location: {
      lat: 37.5665 + (Math.random() - 0.5) * 0.1,
      lng: 126.9780 + (Math.random() - 0.5) * 0.1,
      address: `서울시 중구 ${Math.floor(Math.random() * 100)}번지`
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastActiveAt: new Date()
  }
}

function generateMockUserBadges(userId: string): Badge[] {
  const allBadges = Object.values(BADGES)
  const earnedCount = Math.floor(Math.random() * allBadges.length)

  return allBadges
    .sort(() => Math.random() - 0.5)
    .slice(0, earnedCount)
    .map(badgeConfig => ({
      id: badgeConfig.id,
      name: badgeConfig.name,
      description: badgeConfig.description,
      iconUrl: badgeConfig.iconUrl,
      unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }))
}

function generateMockLeaderboard(
  type: 'national' | 'regional' | 'local',
  count: number
): Array<User & { rank: number; weeklyPoints: number }> {
  return Array.from({ length: count }, (_, i) => {
    const user = generateMockUser(`user_${i}`)
    return {
      ...user,
      rank: i + 1,
      weeklyPoints: Math.floor(Math.random() * 1000)
    }
  }).sort((a, b) => b.points - a.points)
}