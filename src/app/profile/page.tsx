'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import UserLevelCard from '@/components/gamification/UserLevelCard'
import BadgeGallery from '@/components/gamification/BadgeGallery'
import Leaderboard from '@/components/gamification/Leaderboard'
import PointsDisplay from '@/components/gamification/PointsDisplay'
import AchievementNotification from '@/components/gamification/AchievementNotification'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getUserStats, getLeaderboard } from '@/lib/api/gamification'
import { useUserStore } from '@/stores/userStore'
import { User } from '@/types'
import { formatNumber } from '@/lib/utils'

type ViewMode = 'overview' | 'badges' | 'leaderboard' | 'stats'

interface Achievement {
  type: 'badge' | 'level_up' | 'points'
  badge?: any
  levelName?: string
  levelNumber?: number
  points?: number
  title: string
  description: string
}

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [stats, setStats] = useState<any>(null)
  const [leaderboardData, setLeaderboardData] = useState<any>(null)
  const [achievement, setAchievement] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useUserStore()

  useEffect(() => {
    if (user) {
      loadUserStats()
      loadLeaderboard()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await getUserStats(user.id)
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('통계 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLeaderboard = async () => {
    if (!user) return

    try {
      const response = await getLeaderboard('national', user.id)
      if (response.success && response.data) {
        setLeaderboardData(response.data)
      }
    } catch (error) {
      console.error('리더보드 로드 실패:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600">프로필을 보려면 먼저 로그인하세요.</p>
        </div>
      </div>
    )
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
            내 프로필
          </h1>
          <p className="text-gray-600">
            나의 활동과 성취를 확인하세요
          </p>
        </motion.header>

        {/* 내비게이션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center space-x-2 mb-8 overflow-x-auto"
        >
          <Button
            onClick={() => setViewMode('overview')}
            variant={viewMode === 'overview' ? 'primary' : 'secondary'}
            size="sm"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            개요
          </Button>
          <Button
            onClick={() => setViewMode('badges')}
            variant={viewMode === 'badges' ? 'primary' : 'secondary'}
            size="sm"
          >
            <StarIcon className="h-4 w-4 mr-2" />
            배지
          </Button>
          <Button
            onClick={() => setViewMode('leaderboard')}
            variant={viewMode === 'leaderboard' ? 'primary' : 'secondary'}
            size="sm"
          >
            <TrophyIcon className="h-4 w-4 mr-2" />
            순위
          </Button>
          <Button
            onClick={() => setViewMode('stats')}
            variant={viewMode === 'stats' ? 'primary' : 'secondary'}
            size="sm"
          >
            <UsersIcon className="h-4 w-4 mr-2" />
            통계
          </Button>
        </motion.div>

        {/* 컨텐츠 */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'overview' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 사용자 레벨 카드 */}
              <UserLevelCard user={user} showDetails={true} />

              {/* 빠른 통계 */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="text-center py-6">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatNumber(stats.totalPoints)}
                      </div>
                      <div className="text-sm text-gray-600">총 포인트</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="text-center py-6">
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.badgeCount}
                      </div>
                      <div className="text-sm text-gray-600">획득 배지</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="text-center py-6">
                      <div className="text-2xl font-bold text-success-600">
                        #{stats.rank.national}
                      </div>
                      <div className="text-sm text-gray-600">전국 순위</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="text-center py-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.achievements.missionsCompleted}
                      </div>
                      <div className="text-sm text-gray-600">완료 미션</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 최근 활동 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 활동</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                      <div className="text-success-600">✅</div>
                      <div className="flex-1">
                        <div className="font-medium">에너지 절약 미션 완료</div>
                        <div className="text-sm text-gray-600">2시간 전</div>
                      </div>
                      <div className="text-success-600 font-semibold">+300P</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                      <div className="text-primary-600">📸</div>
                      <div className="flex-1">
                        <div className="font-medium">안전 신고 접수</div>
                        <div className="text-sm text-gray-600">1일 전</div>
                      </div>
                      <div className="text-primary-600 font-semibold">+200P</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-yellow-600">🏆</div>
                      <div className="flex-1">
                        <div className="font-medium">배지 획득: 에너지 절약왕</div>
                        <div className="text-sm text-gray-600">3일 전</div>
                      </div>
                      <div className="text-yellow-600 font-semibold">배지</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === 'badges' && (
            <div className="max-w-4xl mx-auto">
              <BadgeGallery earnedBadges={user.badges} showLocked={true} />
            </div>
          )}

          {viewMode === 'leaderboard' && leaderboardData && (
            <div className="max-w-4xl mx-auto">
              <Leaderboard
                currentUser={user}
                entries={leaderboardData.entries}
                type="national"
              />
            </div>
          )}

          {viewMode === 'stats' && stats && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 상세 통계 */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>활동 통계</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">제출한 신고</span>
                      <span className="font-semibold">{stats.achievements.reportsSubmitted}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">완료한 미션</span>
                      <span className="font-semibold">{stats.achievements.missionsCompleted}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연속 참여</span>
                      <span className="font-semibold">{stats.achievements.consecutiveDays}일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">절약한 에너지</span>
                      <span className="font-semibold">{stats.achievements.energySaved}kWh</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>순위 현황</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">전국 순위</span>
                      <span className="font-semibold">#{formatNumber(stats.rank.national)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">지역 순위</span>
                      <span className="font-semibold">#{formatNumber(stats.rank.regional)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">동네 순위</span>
                      <span className="font-semibold">#{formatNumber(stats.rank.local)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 포인트 현황 */}
              <Card>
                <CardHeader>
                  <CardTitle>포인트 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <PointsDisplay points={stats.totalPoints} size="lg" />
                      <div className="text-sm text-gray-600 mt-2">총 포인트</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatNumber(stats.monthlyPoints)}
                      </div>
                      <div className="text-sm text-gray-600">이번 달</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success-600">
                        {formatNumber(stats.weeklyPoints)}
                      </div>
                      <div className="text-sm text-gray-600">이번 주</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* 성취 알림 */}
        <AchievementNotification
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      </div>
    </div>
  )
}