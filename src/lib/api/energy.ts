import { EnergyMission, EnergyUsage, MissionType, ApiResponse } from '@/types'
import { MISSION_CONFIGS } from '@/lib/constants'

// 에너지 사용량 데이터 조회
export async function getEnergyUsage(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ApiResponse<EnergyUsage[]>> {
  try {
    // 실제로는 AMI 데이터 API 또는 데이터베이스에서 조회
    const mockData = generateMockEnergyData(startDate, endDate)

    return {
      success: true,
      data: mockData
    }
  } catch (error) {
    return {
      success: false,
      error: '에너지 사용량 데이터를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 사용자의 활성 미션 조회
export async function getActiveMissions(userId: string): Promise<ApiResponse<EnergyMission[]>> {
  try {
    // 실제로는 데이터베이스에서 조회
    const missions = generateMockMissions(userId, 'active')

    return {
      success: true,
      data: missions
    }
  } catch (error) {
    return {
      success: false,
      error: '미션 목록을 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 새로운 미션 생성
export async function createMission(
  userId: string,
  type: MissionType,
  customTarget?: number
): Promise<ApiResponse<EnergyMission>> {
  try {
    const config = MISSION_CONFIGS[type]
    const targetValue = customTarget || config.defaultTarget

    // AI 기반 개인화된 목표 설정 (실제로는 Claude API 사용)
    const personalizedTarget = await generatePersonalizedTarget(userId, type, targetValue)

    const mission: EnergyMission = {
      id: generateId(),
      userId,
      title: config.name,
      description: config.description,
      type,
      targetValue: personalizedTarget,
      currentValue: 0,
      unit: config.unit,
      startDate: new Date(),
      endDate: getEndDate(type),
      status: 'active',
      rewards: {
        points: calculateRewardPoints(type, personalizedTarget),
        badges: getRewardBadges(type)
      },
      difficulty: getDifficulty(personalizedTarget, config.defaultTarget)
    }

    // 실제로는 데이터베이스에 저장
    await saveMissionToDatabase(mission)

    return {
      success: true,
      data: mission,
      message: '새로운 미션이 생성되었습니다!'
    }
  } catch (error) {
    return {
      success: false,
      error: '미션 생성 중 오류가 발생했습니다.'
    }
  }
}

// 미션 진행률 업데이트
export async function updateMissionProgress(
  missionId: string,
  currentValue: number
): Promise<ApiResponse<EnergyMission>> {
  try {
    // 실제로는 데이터베이스에서 미션 조회 및 업데이트
    const mission = await getMissionFromDatabase(missionId)

    if (!mission) {
      return {
        success: false,
        error: '미션을 찾을 수 없습니다.'
      }
    }

    const updatedMission = {
      ...mission,
      currentValue: Math.min(currentValue, mission.targetValue),
      status: currentValue >= mission.targetValue ? 'completed' as const : mission.status
    }

    await saveMissionToDatabase(updatedMission)

    return {
      success: true,
      data: updatedMission
    }
  } catch (error) {
    return {
      success: false,
      error: '미션 진행률 업데이트 중 오류가 발생했습니다.'
    }
  }
}

// 미션 완료 처리
export async function completeMission(missionId: string): Promise<ApiResponse<{
  mission: EnergyMission
  rewards: { points: number; badges?: string[] }
}>> {
  try {
    const mission = await getMissionFromDatabase(missionId)

    if (!mission) {
      return {
        success: false,
        error: '미션을 찾을 수 없습니다.'
      }
    }

    if (mission.currentValue < mission.targetValue) {
      return {
        success: false,
        error: '미션이 아직 완료되지 않았습니다.'
      }
    }

    const completedMission = {
      ...mission,
      status: 'completed' as const
    }

    await saveMissionToDatabase(completedMission)

    return {
      success: true,
      data: {
        mission: completedMission,
        rewards: mission.rewards
      },
      message: '미션을 완료했습니다! 보상이 지급되었습니다.'
    }
  } catch (error) {
    return {
      success: false,
      error: '미션 완료 처리 중 오류가 발생했습니다.'
    }
  }
}

// 추천 미션 생성 (AI 기반)
export async function getRecommendedMissions(userId: string): Promise<ApiResponse<{
  type: MissionType
  reason: string
  expectedSavings: number
}[]>> {
  try {
    // 실제로는 사용자의 에너지 사용 패턴을 분석하여 AI가 추천
    const recommendations = [
      {
        type: 'peak_reduction' as MissionType,
        reason: '최근 피크시간대 사용량이 평균보다 30% 높습니다.',
        expectedSavings: 15000
      },
      {
        type: 'standby_power' as MissionType,
        reason: '대기전력으로 인한 전력 손실이 예상보다 큽니다.',
        expectedSavings: 8000
      }
    ]

    return {
      success: true,
      data: recommendations
    }
  } catch (error) {
    return {
      success: false,
      error: '추천 미션을 생성하는 중 오류가 발생했습니다.'
    }
  }
}

// 인증 사진 업로드 처리
export async function uploadMissionProof(
  missionId: string,
  imageFile: File
): Promise<ApiResponse<{ verified: boolean; feedback: string }>> {
  try {
    // 실제로는 이미지를 클라우드에 업로드하고 AI로 검증
    const imageUrl = await uploadImage(imageFile)
    const verification = await verifyMissionProof(missionId, imageUrl)

    return {
      success: true,
      data: verification
    }
  } catch (error) {
    return {
      success: false,
      error: '인증 사진 처리 중 오류가 발생했습니다.'
    }
  }
}

// 유틸리티 함수들
async function generatePersonalizedTarget(
  userId: string,
  type: MissionType,
  baseTarget: number
): Promise<number> {
  // 실제로는 사용자의 과거 데이터와 패턴을 분석하여 개인화된 목표 생성
  const personalizedFactor = 0.8 + Math.random() * 0.4 // 0.8 ~ 1.2
  return Math.round(baseTarget * personalizedFactor)
}

function calculateRewardPoints(type: MissionType, target: number): number {
  const basePoints = {
    peak_reduction: 300,
    standby_power: 200,
    monthly_savings: 500,
    continuous_participation: 400
  }

  const difficultyMultiplier = target > MISSION_CONFIGS[type].defaultTarget ? 1.5 : 1
  return Math.round(basePoints[type] * difficultyMultiplier)
}

function getRewardBadges(type: MissionType): string[] | undefined {
  const badgeMap = {
    peak_reduction: ['peak_destroyer'],
    standby_power: ['energy_saver'],
    monthly_savings: ['energy_saver'],
    continuous_participation: ['streak_warrior']
  }

  return badgeMap[type]
}

function getDifficulty(target: number, defaultTarget: number): 'easy' | 'medium' | 'hard' {
  if (target <= defaultTarget * 0.8) return 'easy'
  if (target <= defaultTarget * 1.2) return 'medium'
  return 'hard'
}

function getEndDate(type: MissionType): Date {
  const now = new Date()
  switch (type) {
    case 'peak_reduction':
    case 'standby_power':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 1주일
    case 'monthly_savings':
      return new Date(now.getFullYear(), now.getMonth() + 1, 0) // 이번 달 말
    case 'continuous_participation':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 1주일
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
}

async function uploadImage(file: File): Promise<string> {
  // 실제로는 클라우드 스토리지에 업로드
  return `https://example.com/mission-proofs/${Date.now()}-${file.name}`
}

async function verifyMissionProof(missionId: string, imageUrl: string): Promise<{
  verified: boolean
  feedback: string
}> {
  // 실제로는 AI를 통한 이미지 분석
  const verified = Math.random() > 0.2 // 80% 확률로 성공

  return {
    verified,
    feedback: verified
      ? '인증이 완료되었습니다! 미션을 계속 진행하세요.'
      : '인증 사진이 명확하지 않습니다. 다시 촬영해주세요.'
  }
}

// 모의 데이터 생성 함수들
function generateId(): string {
  return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function saveMissionToDatabase(mission: EnergyMission): Promise<void> {
  // 실제로는 데이터베이스에 저장
  console.log('Saving mission to database:', mission)
}

async function getMissionFromDatabase(missionId: string): Promise<EnergyMission | null> {
  // 실제로는 데이터베이스에서 조회
  const mockMissions = generateMockMissions('user1', 'all')
  return mockMissions.find(m => m.id === missionId) || null
}

function generateMockMissions(userId: string, filter: 'active' | 'completed' | 'all'): EnergyMission[] {
  const types: MissionType[] = ['peak_reduction', 'standby_power', 'monthly_savings', 'continuous_participation']
  const missions: EnergyMission[] = []

  types.forEach((type, index) => {
    const config = MISSION_CONFIGS[type]
    const isCompleted = filter === 'completed' || (filter === 'all' && Math.random() > 0.5)
    const progress = isCompleted ? 1 : Math.random()

    missions.push({
      id: `mission_${type}_${index}`,
      userId,
      title: config.name,
      description: config.description,
      type,
      targetValue: config.defaultTarget,
      currentValue: Math.round(config.defaultTarget * progress),
      unit: config.unit,
      startDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: isCompleted ? 'completed' : 'active',
      rewards: {
        points: calculateRewardPoints(type, config.defaultTarget),
        badges: getRewardBadges(type)
      },
      difficulty: 'medium'
    })
  })

  return filter === 'all' ? missions : missions.filter(m => m.status === filter)
}

function generateMockEnergyData(startDate: Date, endDate: Date): EnergyUsage[] {
  const data: EnergyUsage[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const hourlyUsage = Array.from({ length: 24 }, (_, hour) => {
      // 시간대별 사용량 패턴 시뮬레이션
      const baseUsage = 2000 // 기본 2kW
      const timeMultiplier = hour >= 19 && hour <= 21 ? 2.5 : // 피크시간
                           hour >= 9 && hour <= 18 ? 1.5 :  // 주간
                           0.8 // 야간

      return baseUsage * timeMultiplier * (0.8 + Math.random() * 0.4)
    })

    const totalDaily = hourlyUsage.reduce((sum, usage) => sum + usage, 0)
    const peakUsage = Math.max(...hourlyUsage)
    const peakHours = hourlyUsage
      .map((usage, hour) => ({ usage, hour }))
      .filter(item => item.usage > totalDaily / 24 * 1.5)
      .map(item => item.hour)

    data.push({
      userId: 'user1',
      date: new Date(current),
      hourlyUsage,
      totalDaily,
      peakUsage,
      peakHours,
      cost: totalDaily * 0.1 // 가정: kWh당 100원
    })

    current.setDate(current.getDate() + 1)
  }

  return data
}