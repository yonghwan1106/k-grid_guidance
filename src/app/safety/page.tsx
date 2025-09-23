'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import ReportForm from '@/components/safety/ReportForm'
import ReportList from '@/components/safety/ReportList'
import RiskAnalysis from '@/components/safety/RiskAnalysis'
import { submitSafetyReport, getUserReports } from '@/lib/api/safety'
import { SafetyReport, SafetyCategory } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { useMissionStore } from '@/stores/missionStore'
import { POINTS } from '@/lib/constants'

type ViewMode = 'list' | 'form' | 'analysis'

export default function SafetyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, updatePoints } = useUserStore()
  const { safetyReports, addSafetyReport } = useMissionStore()

  const handleFormSubmit = async (data: {
    imageFile: File
    category: SafetyCategory
    location: { lat: number; lng: number; address: string }
    description: string
  }) => {
    if (!user) return

    setIsSubmitting(true)

    try {
      const response = await submitSafetyReport({
        userId: user.id,
        ...data
      })

      if (response.success && response.data) {
        // 스토어에 신고 추가
        addSafetyReport(response.data)

        // 포인트 계산 및 업데이트
        const basePoints = POINTS.SAFETY_REPORT.BASE
        const riskMultiplier = response.data.riskScore >= 7
          ? POINTS.SAFETY_REPORT.MULTIPLIER_BY_RISK.HIGH
          : response.data.riskScore >= 4
          ? POINTS.SAFETY_REPORT.MULTIPLIER_BY_RISK.MEDIUM
          : POINTS.SAFETY_REPORT.MULTIPLIER_BY_RISK.LOW

        const earnedPoints = basePoints * riskMultiplier
        updatePoints(earnedPoints)

        // 분석 결과 화면으로 이동
        setSelectedReport(response.data)
        setViewMode('analysis')
      }
    } catch (error) {
      console.error('신고 제출 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportClick = (report: SafetyReport) => {
    setSelectedReport(report)
    setViewMode('analysis')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedReport(null)
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
            그리드 워치
          </h1>
          <p className="text-gray-600">
            전력설비 위험요소를 신고하고 AI 분석을 받아보세요
          </p>
        </motion.header>

        {/* 내비게이션 */}
        {(viewMode === 'list' || viewMode === 'form') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
            >
              <ListBulletIcon className="h-5 w-5 mr-2" />
              신고 목록
            </Button>
            <Button
              onClick={() => setViewMode('form')}
              variant={viewMode === 'form' ? 'primary' : 'secondary'}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              새 신고
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
          {viewMode === 'list' && (
            <div className="max-w-2xl mx-auto">
              <ReportList
                reports={safetyReports}
                onReportClick={handleReportClick}
              />
            </div>
          )}

          {viewMode === 'form' && (
            <ReportForm
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
            />
          )}

          {viewMode === 'analysis' && selectedReport && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Button
                  onClick={handleBackToList}
                  variant="secondary"
                >
                  ← 목록으로 돌아가기
                </Button>
              </div>
              <RiskAnalysis report={selectedReport} />
            </div>
          )}
        </motion.div>

        {/* 플로팅 액션 버튼 (목록 화면에서만) */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="fixed bottom-6 right-6"
          >
            <Button
              onClick={() => setViewMode('form')}
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