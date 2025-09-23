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
import { useUserStore } from '@/stores/userStore'
import { useMissionStore } from '@/stores/missionStore'
import { POINTS } from '@/lib/constants'

type ViewMode = 'missions' | 'detail' | 'chart' | 'create'

export default function EnergyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('missions')
  const [selectedMission, setSelectedMission] = useState<EnergyMission | null>(null)
  const [energyData, setEnergyData] = useState<EnergyUsage[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const { user, updatePoints } = useUserStore()
  const { activeMissions, setActiveMissions, completeMission: completeMissionInStore } = useMissionStore()

  useEffect(() => {
    if (user) {
      loadActiveMissions()
      loadEnergyData()
    }
  }, [user])

  const loadActiveMissions = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await getActiveMissions(user.id)
      if (response.success && response.data) {
        setActiveMissions(response.data)
      }
    } catch (error) {
      console.error('미션 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadEnergyData = async () => {
    if (!user) return

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30일 전

    try {
      const response = await getEnergyUsage(user.id, startDate, endDate)
      if (response.success && response.data) {
        setEnergyData(response.data)
      }
    } catch (error) {
      console.error('에너지 데이터 로드 실패:', error)
    }
  }

  const handleMissionComplete = async (mission: EnergyMission) => {
    setIsLoading(true)
    try {
      const response = await completeMission(mission.id)
      if (response.success && response.data) {
        // 포인트 업데이트
        updatePoints(response.data.rewards.points)

        // 스토어에서 미션 완료 처리
        completeMissionInStore(mission.id)

        // 목록으로 돌아가기
        setViewMode('missions')
        setSelectedMission(null)
      }
    } catch (error) {
      console.error('미션 완료 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMission = async (type: MissionType) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await createMission(user.id, type)
      if (response.success && response.data) {
        // 새 미션을 목록에 추가
        setActiveMissions([...activeMissions, response.data])
        setViewMode('missions')
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