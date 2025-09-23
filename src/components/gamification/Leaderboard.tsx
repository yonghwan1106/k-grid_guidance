'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { User } from '@/types'
import { calculateUserLevel, formatNumber } from '@/lib/utils'

interface LeaderboardEntry extends User {
  rank: number
  weeklyPoints: number
}

interface LeaderboardProps {
  currentUser: User
  entries: LeaderboardEntry[]
  type?: 'national' | 'regional' | 'local'
}

export default function Leaderboard({
  currentUser,
  entries,
  type = 'national'
}: LeaderboardProps) {
  const [selectedType, setSelectedType] = useState(type)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'national':
        return '전국'
      case 'regional':
        return '지역'
      case 'local':
        return '동네'
      default:
        return '전국'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'national':
        return '🇰🇷'
      case 'regional':
        return '🏙️'
      case 'local':
        return '🏘️'
      default:
        return '🇰🇷'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-amber-600 to-amber-800'
      default:
        return 'from-gray-100 to-gray-200'
    }
  }

  const currentUserRank = entries.find(e => e.id === currentUser.id)?.rank || 0

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">리더보드</h2>

        {/* 타입 선택 */}
        <div className="flex justify-center space-x-2 mb-6">
          {['national', 'regional', 'local'].map((typeOption) => (
            <Button
              key={typeOption}
              onClick={() => setSelectedType(typeOption)}
              variant={selectedType === typeOption ? 'primary' : 'secondary'}
              size="sm"
            >
              {getTypeIcon(typeOption)} {getTypeLabel(typeOption)}
            </Button>
          ))}
        </div>
      </div>

      {/* 현재 사용자 순위 */}
      {currentUserRank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-primary-600">
                  #{currentUserRank}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {currentUser.name} (나)
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatNumber(currentUser.points)} 포인트
                  </div>
                </div>
                <Badge variant="primary">
                  {calculateUserLevel(currentUser.points).name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 상위 3명 포디움 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🏆 TOP 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end space-x-4">
              {/* 2등 */}
              {entries[1] && (
                <div className="text-center">
                  <div className="w-16 h-20 bg-gradient-to-t from-gray-300 to-gray-500 rounded-t-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    {entries[1].avatarUrl ? (
                      <img
                        src={entries[1].avatarUrl}
                        alt={entries[1].name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold">
                        {entries[1].name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium">{entries[1].name}</div>
                  <div className="text-xs text-gray-600">
                    {formatNumber(entries[1].points)}P
                  </div>
                </div>
              )}

              {/* 1등 */}
              {entries[0] && (
                <div className="text-center">
                  <div className="text-2xl mb-1">👑</div>
                  <div className="w-20 h-24 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="w-14 h-14 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-yellow-400">
                    {entries[0].avatarUrl ? (
                      <img
                        src={entries[0].avatarUrl}
                        alt={entries[0].name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-yellow-600 font-bold">
                        {entries[0].name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold">{entries[0].name}</div>
                  <div className="text-xs text-gray-600">
                    {formatNumber(entries[0].points)}P
                  </div>
                </div>
              )}

              {/* 3등 */}
              {entries[2] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-t from-amber-600 to-amber-800 rounded-t-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    {entries[2].avatarUrl ? (
                      <img
                        src={entries[2].avatarUrl}
                        alt={entries[2].name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-amber-600 font-bold">
                        {entries[2].name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium">{entries[2].name}</div>
                  <div className="text-xs text-gray-600">
                    {formatNumber(entries[2].points)}P
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 전체 순위 리스트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>전체 순위</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {entries.slice(0, 10).map((entry, index) => {
                const isCurrentUser = entry.id === currentUser.id
                const userLevel = calculateUserLevel(entry.points)

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors ${
                      isCurrentUser ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                    }`}
                  >
                    {/* 순위 */}
                    <div className="w-8 text-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-lg font-bold text-gray-600">
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* 프로필 */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt={entry.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-bold">
                          {entry.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* 사용자 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {entry.name}
                          {isCurrentUser && (
                            <span className="text-primary-600 ml-1">(나)</span>
                          )}
                        </span>
                        <Badge
                          variant="outline"
                          size="sm"
                          style={{ color: userLevel.color }}
                        >
                          {userLevel.name}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        레벨 {userLevel.level} • {entry.badges.length}개 배지
                      </div>
                    </div>

                    {/* 포인트 */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatNumber(entry.points)}
                      </div>
                      <div className="text-xs text-gray-600">
                        +{formatNumber(entry.weeklyPoints)} 이번 주
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}