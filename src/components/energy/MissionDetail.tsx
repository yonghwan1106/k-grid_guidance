'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon, TrophyIcon, CameraIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { EnergyMission } from '@/types'
import { MISSION_CONFIGS } from '@/lib/constants'
import { formatDate, formatEnergy } from '@/lib/utils'

interface MissionDetailProps {
  mission: EnergyMission
  onComplete?: (mission: EnergyMission) => void
  onUploadProof?: (mission: EnergyMission, file: File) => void
}

export default function MissionDetail({
  mission,
  onComplete,
  onUploadProof
}: MissionDetailProps) {
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  const config = MISSION_CONFIGS[mission.type]
  const progress = (mission.currentValue / mission.targetValue) * 100
  const isCompleted = mission.currentValue >= mission.targetValue
  const timeRemaining = new Date(mission.endDate).getTime() - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProofImage(file)
    setProofPreview(URL.createObjectURL(file))
  }

  const handleSubmitProof = () => {
    if (proofImage) {
      onUploadProof?.(mission, proofImage)
    }
  }

  const getTips = () => {
    switch (mission.type) {
      case 'peak_reduction':
        return [
          '19-21시 에어컨 설정온도를 1-2도 올려보세요',
          '피크시간에 세탁기, 건조기 사용을 피해보세요',
          '불필요한 조명을 끄고 LED 조명을 사용하세요',
          '전기밥솥 보온기능을 끄고 필요할 때만 사용하세요'
        ]
      case 'standby_power':
        return [
          'TV, 오디오의 플러그를 뽑아보세요',
          '컴퓨터 사용 후 완전히 종료하세요',
          '충전기는 사용 후 반드시 뽑아보세요',
          '멀티탭 스위치를 활용해 대기전력을 차단하세요'
        ]
      case 'monthly_savings':
        return [
          '에어컨 필터를 정기적으로 청소하세요',
          '냉장고 적정온도를 유지하세요 (냉장 3-4도, 냉동 -18도)',
          '샤워시간을 줄이고 절수형 샤워헤드를 사용하세요',
          '자연광을 최대한 활용하고 불필요한 조명을 끄세요'
        ]
      case 'continuous_participation':
        return [
          '매일 에너지 사용량을 확인하는 습관을 만들어보세요',
          '가족과 함께 에너지 절약 목표를 공유하세요',
          '절약한 전기요금으로 소소한 보상을 계획해보세요',
          '이웃과 함께 에너지 절약 챌린지에 참여해보세요'
        ]
      default:
        return []
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 미션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{config.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-xl">{mission.title}</CardTitle>
                <p className="text-gray-600 mt-1">{mission.description}</p>
              </div>
              <Badge
                variant={isCompleted ? 'success' : 'default'}
                size="lg"
              >
                {mission.status === 'completed' ? '완료' : '진행중'}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* 진행 상황 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary-600">
                {progress.toFixed(1)}%
              </div>
              <div className="text-gray-600">
                {mission.currentValue} / {mission.targetValue} {mission.unit}
              </div>
              <ProgressBar
                value={progress}
                variant={isCompleted ? 'success' : 'default'}
                size="lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-sm">남은 시간</span>
                </div>
                <div className="text-lg font-semibold">
                  {daysRemaining > 0 ? `${daysRemaining}일` : '곧 마감'}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                  <TrophyIcon className="h-4 w-4" />
                  <span className="text-sm">예상 보상</span>
                </div>
                <div className="text-lg font-semibold text-primary-600">
                  {mission.rewards.points}P
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 인증 사진 업로드 */}
      {(mission.type === 'standby_power' || mission.type === 'peak_reduction') && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>실행 인증</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                {mission.type === 'standby_power'
                  ? '플러그를 뽑은 상태의 사진을 촬영해주세요'
                  : '에어컨 리모컨 설정 화면을 촬영해주세요'}
              </p>

              <div className="space-y-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleProofUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    {proofPreview ? (
                      <div className="space-y-2">
                        <img
                          src={proofPreview}
                          alt="인증 사진"
                          className="w-full max-w-xs mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600">다시 촬영하려면 클릭하세요</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <CameraIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-gray-600">인증 사진을 촬영하세요</p>
                      </div>
                    )}
                  </div>
                </label>

                {proofImage && (
                  <Button
                    onClick={handleSubmitProof}
                    variant="primary"
                    className="w-full"
                  >
                    인증 사진 제출
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 실천 팁 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>실천 팁</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getTips().map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* 완료 버튼 */}
      {isCompleted && mission.status !== 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={() => onComplete?.(mission)}
            variant="success"
            size="lg"
            className="px-8"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            미션 완료하기
          </Button>
        </motion.div>
      )}
    </div>
  )
}