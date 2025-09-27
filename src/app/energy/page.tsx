'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, ChartBarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import MissionCard from '@/components/energy/MissionCard'
import MissionDetail from '@/components/energy/MissionDetail'
import EnergyUsageChart from '@/components/energy/EnergyUsageChart'
import { getActiveMissions, getEnergyUsage, completeMission, createMission } from '@/lib/api/energy'
import { EnergyMission, EnergyUsage, MissionType } from '@/types'
import { useMissionStore } from '@/stores/missionStore'
import { POINTS } from '@/lib/constants'

type ViewMode = 'missions' | 'detail' | 'chart' | 'create'

export default function EnergyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('missions')
  const [selectedMission, setSelectedMission] = useState<EnergyMission | null>(null)
  const [energyData, setEnergyData] = useState<EnergyUsage[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const { activeMissions, setActiveMissions, completeMission: completeMissionInStore } = useMissionStore()

  useEffect(() => {
    // 프로토타입 모드에서는 기본 데모 데이터 로드
    loadActiveMissions()
    loadEnergyData()
  }, [])

  const loadActiveMissions = async () => {
    setIsLoading(true)
    try {
      // 프로토타입 모드: 데모 데이터 생성
      const demoMissions: EnergyMission[] = [
        {
          id: 'demo-1',
          userId: 'demo-user',
          title: '피크시간 사용량 20% 줄이기',
          description: '오후 2-6시 사이 에어컨 사용량을 평소보다 20% 줄여보세요',
          type: 'peak_reduction',
          targetValue: 20,
          currentValue: 5,
          unit: '%',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
          status: 'active',
          rewards: { points: 300 },
          difficulty: 'easy'
        },
        {
          id: 'demo-2',
          userId: 'demo-user',
          title: '대기전력 차단하기',
          description: '사용하지 않는 전자기기의 플러그를 뽑아 대기전력을 차단하세요',
          type: 'standby_power',
          targetValue: 10,
          currentValue: 7,
          unit: '개',
          startDate: new Date(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
          status: 'active',
          rewards: { points: 200 },
          difficulty: 'easy'
        }
      ]
      setActiveMissions(demoMissions)
    } catch (error) {
      console.error('미션 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadEnergyData = async () => {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30일 전

    try {
      // 프로토타입 모드: 실제적인 데모 에너지 데이터 생성
      const demoData: EnergyUsage[] = []
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
        const hourlyUsage = Array.from({ length: 24 }, (_, hour) => {
          // 실제적인 시간대별 사용 패턴
          let baseUsage = 0.5 // 기본 사용량 (밤시간)

          if (hour >= 6 && hour < 9) baseUsage = 2.8 // 아침 시간대
          else if (hour >= 9 && hour < 12) baseUsage = 1.8 // 오전
          else if (hour >= 12 && hour < 14) baseUsage = 2.2 // 점심
          else if (hour >= 14 && hour < 18) baseUsage = 3.2 // 피크시간 (오후)
          else if (hour >= 18 && hour < 21) baseUsage = 2.9 // 저녁
          else if (hour >= 21 && hour < 23) baseUsage = 2.1 // 밤

          const randomVariation = (Math.random() - 0.5) * 0.4
          return Math.max(0.1, baseUsage + randomVariation)
        })

        const totalDaily = hourlyUsage.reduce((sum, usage) => sum + usage, 0)
        const maxUsage = Math.max(...hourlyUsage)
        const peakHoursList = hourlyUsage
          .map((usage, hour) => Math.abs(usage - maxUsage) < 0.1 ? hour : -1)
          .filter(h => h !== -1)

        demoData.push({
          userId: 'demo-user',
          date,
          hourlyUsage,
          totalDaily,
          peakUsage: maxUsage,
          peakHours: peakHoursList,
          cost: totalDaily * 120 // kWh당 120원
        })
      }
      setEnergyData(demoData)
    } catch (error) {
      console.error('에너지 데이터 로드 실패:', error)
    }
  }

  const handleMissionComplete = async (mission: EnergyMission) => {
    setIsLoading(true)
    try {
      // 프로토타입 모드: 미션 완료 시뮬레이션
      console.log('미션 완료:', mission.title, '+' + mission.rewards.points + 'P')

      // 스토어에서 미션 완료 처리
      completeMissionInStore(mission.id)

      // 목록으로 돌아가기
      setViewMode('missions')
      setSelectedMission(null)
    } catch (error) {
      console.error('미션 완료 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMission = async (type: MissionType) => {
    setIsLoading(true)
    try {
      // 프로토타입 모드: 데모 미션 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 대기로 로딩 시뮬레이션

      const missionConfigs = {
        peak_reduction: {
          title: '피크시간 사용량 20% 줄이기',
          description: '오후 2-6시 사이 에어컨 사용량을 평소보다 20% 줄여보세요',
          targetValue: 20,
          unit: '%',
          rewards: { points: 300 },
          difficulty: 'easy' as const
        },
        standby_power: {
          title: '대기전력 차단하기',
          description: '사용하지 않는 전자기기의 플러그를 뽑아 대기전력을 차단하세요',
          targetValue: 10,
          unit: '개',
          rewards: { points: 200 },
          difficulty: 'easy' as const
        },
        monthly_savings: {
          title: '월간 에너지 절약',
          description: '전월 대비 전력 사용량을 줄이세요',
          targetValue: 15,
          unit: '%',
          rewards: { points: 500 },
          difficulty: 'hard' as const
        },
        continuous_participation: {
          title: '연속 참여',
          description: '매일 미션에 참여하여 습관을 만드세요',
          targetValue: 7,
          unit: '일',
          rewards: { points: 400 },
          difficulty: 'medium' as const
        }
      }

      const config = missionConfigs[type]
      if (config) {
        const newMission: EnergyMission = {
          id: `demo-new-${Date.now()}`,
          userId: 'demo-user',
          title: config.title,
          description: config.description,
          type,
          targetValue: config.targetValue,
          currentValue: 0,
          unit: config.unit,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
          status: 'active',
          rewards: config.rewards,
          difficulty: config.difficulty
        }

        // 새 미션을 목록에 추가
        setActiveMissions([...activeMissions, newMission])
        setViewMode('missions')
        console.log('새 미션 생성:', newMission.title)
      }
    } catch (error) {
      console.error('미션 생성 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMissionClick = (mission: EnergyMission) => {
    setSelectedMission(mission)
    setViewMode('detail')
  }

  const handleBackToMissions = () => {
    setViewMode('missions')
    setSelectedMission(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            세이버 퀘스트
          </h1>
          <p className="text-gray-600">
            개인화된 에너지 절약 미션으로 효율을 개선하세요
          </p>
        </motion.header>

        {/* 내비게이션 */}
        {(viewMode === 'missions' || viewMode === 'chart' || viewMode === 'create') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <Button
              onClick={() => setViewMode('missions')}
              variant={viewMode === 'missions' ? 'primary' : 'secondary'}
            >
              <ListBulletIcon className="h-5 w-5 mr-2" />
              내 미션
            </Button>
            <Button
              onClick={() => setViewMode('chart')}
              variant={viewMode === 'chart' ? 'primary' : 'secondary'}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              사용량 분석
            </Button>
            <Button
              onClick={() => setViewMode('create')}
              variant={viewMode === 'create' ? 'primary' : 'secondary'}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              새 미션
            </Button>
          </motion.div>
        )}

        {/* 컨텐츠 */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'missions' && (
            <div className="max-w-4xl mx-auto">
              {activeMissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    활성 미션이 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6">
                    첫 번째 에너지 절약 미션을 시작해보세요!
                  </p>
                  <Button
                    onClick={() => setViewMode('create')}
                    size="lg"
                  >
                    미션 만들기
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onComplete={handleMissionComplete}
                      onViewDetails={handleMissionClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'detail' && selectedMission && (
            <div>
              <div className="mb-6 max-w-2xl mx-auto">
                <Button
                  onClick={handleBackToMissions}
                  variant="secondary"
                >
                  ← 미션 목록으로
                </Button>
              </div>
              <MissionDetail
                mission={selectedMission}
                onComplete={handleMissionComplete}
              />
            </div>
          )}

          {viewMode === 'chart' && (
            <div className="max-w-4xl mx-auto">
              <EnergyUsageChart
                data={energyData}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          )}

          {viewMode === 'create' && (
            <div className="max-w-2xl mx-auto">
              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    새로운 미션 선택
                  </h2>
                  <p className="text-gray-600">
                    당신에게 맞는 에너지 절약 미션을 선택하세요
                  </p>
                </motion.div>

                {Object.entries({
                  peak_reduction: {
                    title: '피크시간 사용량 감소',
                    description: '19-21시 전력 사용량을 줄여 요금을 절약하세요',
                    icon: '📉',
                    difficulty: 'medium',
                    expectedReward: '300P'
                  },
                  standby_power: {
                    title: '대기전력 차단',
                    description: '사용하지 않는 전자기기의 플러그를 뽑으세요',
                    icon: '🔌',
                    difficulty: 'easy',
                    expectedReward: '200P'
                  },
                  monthly_savings: {
                    title: '월간 에너지 절약',
                    description: '전월 대비 전력 사용량을 줄이세요',
                    icon: '📊',
                    difficulty: 'hard',
                    expectedReward: '500P'
                  },
                  continuous_participation: {
                    title: '연속 참여',
                    description: '매일 미션에 참여하여 습관을 만드세요',
                    icon: '🔥',
                    difficulty: 'medium',
                    expectedReward: '400P'
                  }
                }).map(([type, config], index) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleCreateMission(type as MissionType)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{config.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {config.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {config.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            config.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                            config.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                            'bg-danger-100 text-danger-800'
                          }`}>
                            {config.difficulty === 'easy' ? '쉬움' :
                             config.difficulty === 'medium' ? '보통' : '어려움'}
                          </span>
                          <span className="text-xs text-primary-600 font-medium">
                            {config.expectedReward}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* 플로팅 액션 버튼 */}
        {viewMode === 'missions' && activeMissions.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="fixed bottom-6 right-6"
          >
            <Button
              onClick={() => setViewMode('create')}
              size="lg"
              className="rounded-full p-4 shadow-lg"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}