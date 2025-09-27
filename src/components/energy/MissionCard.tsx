'use client'

import { motion } from 'framer-motion'
import { PlayIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { EnergyMission } from '@/types'
import { MISSION_CONFIGS } from '@/lib/constants'
import { formatDate, formatEnergy } from '@/lib/utils'

interface MissionCardProps {
  mission: EnergyMission
  onStart?: (mission: EnergyMission) => void
  onComplete?: (mission: EnergyMission) => void
  onViewDetails?: (mission: EnergyMission) => void
}

export default function MissionCard({
  mission,
  onStart,
  onComplete,
  onViewDetails
}: MissionCardProps) {
  const config = MISSION_CONFIGS[mission.type]
  const progress = (mission.currentValue / mission.targetValue) * 100
  const isCompleted = mission.currentValue >= mission.targetValue
  const timeRemaining = new Date(mission.endDate).getTime() - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const getStatusIcon = () => {
    switch (mission.status) {
      case 'active':
        return <ClockIcon className="h-5 w-5 text-primary-500" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />
      case 'paused':
        return <ClockIcon className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusVariant = () => {
    switch (mission.status) {
      case 'active':
        return 'primary'
      case 'completed':
        return 'success'
      case 'failed':
        return 'danger'
      case 'paused':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = () => {
    switch (mission.status) {
      case 'active':
        return '진행중'
      case 'completed':
        return '완료'
      case 'failed':
        return '실패'
      case 'paused':
        return '일시정지'
      default:
        return '알 수 없음'
    }
  }

  const getDifficultyColor = () => {
    switch (mission.difficulty) {
      case 'easy':
        return 'text-success-600'
      case 'medium':
        return 'text-warning-600'
      case 'hard':
        return 'text-danger-600'
      default:
        return 'text-gray-600'
    }
  }

  const getDifficultyText = () => {
    switch (mission.difficulty) {
      case 'easy':
        return '쉬움'
      case 'medium':
        return '보통'
      case 'hard':
        return '어려움'
      default:
        return '알 수 없음'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        hoverable
        className="cursor-pointer"
        onClick={() => onViewDetails?.(mission)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{config.icon}</div>
              <div>
                <CardTitle className="text-lg">{mission.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {mission.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge variant={getStatusVariant() as any} size="sm">
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 진행률 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">진행률</span>
              <span className="font-medium">
                {mission.currentValue}/{mission.targetValue} {mission.unit}
              </span>
            </div>
            <ProgressBar
              value={progress}
              variant={isCompleted ? 'success' : 'default'}
              size="md"
            />
          </div>

          {/* 미션 정보 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">난이도</span>
              <div className={`font-medium ${getDifficultyColor()}`}>
                {getDifficultyText()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">남은 시간</span>
              <div className="font-medium">
                {daysRemaining > 0 ? `${daysRemaining}일` : '곧 마감'}
              </div>
            </div>
            <div>
              <span className="text-gray-600">보상</span>
              <div className="font-medium text-primary-600">
                {mission.rewards.points}P
              </div>
            </div>
            <div>
              <span className="text-gray-600">기간</span>
              <div className="font-medium">
                {formatDate(mission.startDate)} ~ {formatDate(mission.endDate)}
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex space-x-2 pt-2" onClick={(e) => e.stopPropagation()}>
            {mission.status === 'active' && !isCompleted && (
              <Button
                onClick={() => onViewDetails?.(mission)}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                진행 상황 보기
              </Button>
            )}

            {mission.status === 'active' && isCompleted && (
              <Button
                onClick={() => onComplete?.(mission)}
                variant="success"
                size="sm"
                className="flex-1"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                완료하기
              </Button>
            )}

            {mission.status === 'paused' && (
              <Button
                onClick={() => onStart?.(mission)}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                <PlayIcon className="h-4 w-4 mr-1" />
                다시 시작
              </Button>
            )}

            <Button
              onClick={() => onViewDetails?.(mission)}
              variant="secondary"
              size="sm"
            >
              상세보기
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}