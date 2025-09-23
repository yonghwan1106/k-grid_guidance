'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface PointsDisplayProps {
  points: number
  recentEarned?: number
  showAnimation?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function PointsDisplay({
  points,
  recentEarned = 0,
  showAnimation = false,
  size = 'md'
}: PointsDisplayProps) {
  const [showEarned, setShowEarned] = useState(false)
  const [animatedPoints, setAnimatedPoints] = useState(points)

  useEffect(() => {
    if (recentEarned > 0 && showAnimation) {
      setShowEarned(true)

      // 포인트 카운트업 애니메이션
      const startPoints = points - recentEarned
      const duration = 1000
      const steps = 30
      const increment = recentEarned / steps
      let current = startPoints

      const timer = setInterval(() => {
        current += increment
        if (current >= points) {
          current = points
          clearInterval(timer)
        }
        setAnimatedPoints(Math.floor(current))
      }, duration / steps)

      // 획득 포인트 표시 자동 숨김
      const hideTimer = setTimeout(() => {
        setShowEarned(false)
      }, 3000)

      return () => {
        clearInterval(timer)
        clearTimeout(hideTimer)
      }
    } else {
      setAnimatedPoints(points)
    }
  }, [points, recentEarned, showAnimation])

  const sizeClasses = {
    sm: {
      points: 'text-lg',
      label: 'text-xs',
      icon: 'h-4 w-4',
      earned: 'text-sm'
    },
    md: {
      points: 'text-2xl',
      label: 'text-sm',
      icon: 'h-5 w-5',
      earned: 'text-base'
    },
    lg: {
      points: 'text-4xl',
      label: 'text-base',
      icon: 'h-6 w-6',
      earned: 'text-lg'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className="relative inline-flex items-center">
      <motion.div
        className="flex items-center space-x-2"
        animate={showAnimation && recentEarned > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <SparklesIcon className={`${classes.icon} text-primary-600`} />
        <div className="text-center">
          <motion.div
            className={`${classes.points} font-bold text-primary-600`}
            key={animatedPoints}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
          >
            {formatNumber(animatedPoints)}
          </motion.div>
          <div className={`${classes.label} text-gray-600`}>포인트</div>
        </div>
      </motion.div>

      {/* 획득 포인트 애니메이션 */}
      <AnimatePresence>
        {showEarned && recentEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <div className="flex items-center space-x-1 bg-success-500 text-white px-3 py-1 rounded-full shadow-lg">
              <PlusIcon className="h-3 w-3" />
              <span className={`${classes.earned} font-semibold`}>
                {formatNumber(recentEarned)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}