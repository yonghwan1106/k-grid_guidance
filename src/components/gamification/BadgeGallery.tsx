'use client'

import { motion } from 'framer-motion'
import { LockClosedIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Badge as BadgeType } from '@/types'
import { BADGES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

interface BadgeGalleryProps {
  earnedBadges: BadgeType[]
  showLocked?: boolean
}

export default function BadgeGallery({ earnedBadges, showLocked = true }: BadgeGalleryProps) {
  const allBadges = Object.values(BADGES)
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.id))

  const getBadgeStatus = (badgeId: string) => {
    return earnedBadgeIds.has(badgeId) ? 'earned' : 'locked'
  }

  const getEarnedBadge = (badgeId: string) => {
    return earnedBadges.find(b => b.id === badgeId)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">배지 컬렉션</h2>
        <p className="text-gray-600">
          {earnedBadges.length}개 / {allBadges.length}개 획득
        </p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-success-600">
              {earnedBadges.length}
            </div>
            <div className="text-sm text-gray-600">획득</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-gray-400">
              {allBadges.length - earnedBadges.length}
            </div>
            <div className="text-sm text-gray-600">미획득</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round((earnedBadges.length / allBadges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">완성도</div>
          </CardContent>
        </Card>
      </div>

      {/* 배지 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBadges.map((badge, index) => {
          const status = getBadgeStatus(badge.id)
          const earnedBadge = getEarnedBadge(badge.id)
          const isEarned = status === 'earned'

          if (!showLocked && !isEarned) return null

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden transition-all duration-300 ${
                  isEarned
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="p-4 text-center">
                  {/* 배지 아이콘 */}
                  <div className="relative mb-3">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                        isEarned
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      {isEarned ? (
                        <StarIcon className="h-8 w-8 text-white" />
                      ) : (
                        <LockClosedIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* 획득 표시 */}
                    {isEarned && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* 배지 정보 */}
                  <h3 className={`font-semibold mb-1 ${
                    isEarned ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {badge.name}
                  </h3>

                  <p className={`text-xs mb-2 ${
                    isEarned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {badge.description}
                  </p>

                  {/* 획득 날짜 또는 상태 */}
                  {isEarned && earnedBadge ? (
                    <Badge variant="success" size="sm">
                      {formatDate(earnedBadge.unlockedAt)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" size="sm">
                      미획득
                    </Badge>
                  )}
                </CardContent>

                {/* 잠금 오버레이 */}
                {!isEarned && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
                    <LockClosedIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* 최근 획득 배지 */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>최근 획득 배지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnedBadges
                .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
                .slice(0, 3)
                .map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <StarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {badge.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(badge.unlockedAt)}
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      NEW
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}