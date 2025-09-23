'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import { Badge } from '@/types'
import { formatNumber } from '@/lib/utils'

interface Achievement {
  type: 'badge' | 'level_up' | 'points'
  badge?: Badge
  levelName?: string
  levelNumber?: number
  points?: number
  title: string
  description: string
}

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(onClose, 300) // 애니메이션 완료 후 닫기
        }, duration)

        return () => clearTimeout(timer)
      }
    }
  }, [achievement, autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const getIcon = () => {
    switch (achievement?.type) {
      case 'badge':
        return <StarIcon className="h-8 w-8 text-yellow-500" />
      case 'level_up':
        return <TrophyIcon className="h-8 w-8 text-purple-500" />
      case 'points':
        return <span className="text-2xl">💎</span>
      default:
        return <StarIcon className="h-8 w-8 text-yellow-500" />
    }
  }

  const getBackgroundGradient = () => {
    switch (achievement?.type) {
      case 'badge':
        return 'from-yellow-400 to-yellow-600'
      case 'level_up':
        return 'from-purple-400 to-purple-600'
      case 'points':
        return 'from-blue-400 to-blue-600'
      default:
        return 'from-yellow-400 to-yellow-600'
    }
  }

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: isVisible ? 1 : 0, rotateY: isVisible ? 0 : -180 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.6
            }}
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 배경 효과 */}
            <div className="absolute inset-0 animate-pulse">
              <div className={`w-full h-full bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl opacity-20 blur-xl`} />
            </div>

            {/* 메인 카드 */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* 헤더 배경 */}
              <div className={`h-20 bg-gradient-to-r ${getBackgroundGradient()}`} />

              {/* 닫기 버튼 */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* 아이콘 */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  {getIcon()}
                </motion.div>
              </div>

              {/* 콘텐츠 */}
              <div className="pt-12 pb-8 px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {achievement.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {achievement.description}
                  </p>

                  {/* 상세 정보 */}
                  <div className="space-y-4">
                    {achievement.type === 'badge' && achievement.badge && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="text-lg font-semibold text-yellow-800">
                          🏅 {achievement.badge.name}
                        </div>
                        <div className="text-sm text-yellow-600 mt-1">
                          {achievement.badge.description}
                        </div>
                      </div>
                    )}

                    {achievement.type === 'level_up' && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-lg font-semibold text-purple-800">
                          🎯 레벨 {achievement.levelNumber}
                        </div>
                        <div className="text-sm text-purple-600 mt-1">
                          {achievement.levelName}
                        </div>
                      </div>
                    )}

                    {achievement.type === 'points' && achievement.points && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-lg font-semibold text-blue-800">
                          +{formatNumber(achievement.points)} 포인트
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          포인트가 적립되었습니다
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 확인 버튼 */}
                  <div className="mt-6">
                    <Button
                      onClick={handleClose}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      확인
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* 하단 반짝이 효과 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
            </div>

            {/* 파티클 효과 */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -50, -100],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + Math.random() * 1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}