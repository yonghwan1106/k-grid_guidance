'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { User } from '@/types'
import { calculateUserLevel, getLevelProgress, getPointsToNextLevel, formatNumber } from '@/lib/utils'

interface UserLevelCardProps {
  user: User
  showDetails?: boolean
}

export default function UserLevelCard({ user, showDetails = true }: UserLevelCardProps) {
  const currentLevel = calculateUserLevel(user.points)
  const progress = getLevelProgress(user.points)
  const pointsToNext = getPointsToNextLevel(user.points)
  const isMaxLevel = pointsToNext === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: currentLevel.color }}
        />

        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4"
                style={{ borderColor: currentLevel.color }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: currentLevel.color }}
              >
                {user.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="outline"
                  className="border-current"
                  style={{ color: currentLevel.color }}
                >
                  <TrophyIcon className="h-4 w-4 mr-1" />
                  {currentLevel.name}
                </Badge>
                <span className="text-sm text-gray-600">
                  레벨 {currentLevel.level}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {formatNumber(user.points)}
              </div>
              <div className="text-sm text-gray-600">포인트</div>
            </div>
          </div>
        </CardHeader>

        {showDetails && (
          <CardContent className="space-y-4">
            {/* 레벨 진행률 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">다음 레벨까지</span>
                <span className="font-medium">
                  {isMaxLevel ? '최고 레벨!' : `${formatNumber(pointsToNext)}P 남음`}
                </span>
              </div>
              <ProgressBar
                value={progress}
                variant="primary"
                size="md"
              />
            </div>

            {/* 배지 미리보기 */}
            {user.badges.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    보유 배지
                  </span>
                  <span className="text-sm text-gray-600">
                    {user.badges.length}개
                  </span>
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {user.badges.slice(0, 5).map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"
                      title={badge.name}
                    >
                      <StarIcon className="h-6 w-6 text-yellow-600" />
                    </motion.div>
                  ))}
                  {user.badges.length > 5 && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
                      +{user.badges.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {user.badges.length}
                </div>
                <div className="text-sm text-gray-600">획득 배지</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">활동 일수</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}