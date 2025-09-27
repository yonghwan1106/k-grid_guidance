'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { SafetyReport } from '@/types'
import { getRiskColor, getRiskLabel, formatDate } from '@/lib/utils'

interface RiskAnalysisProps {
  report: SafetyReport
}

export default function RiskAnalysis({ report }: RiskAnalysisProps) {
  const riskColor = getRiskColor(report.riskScore)
  const riskLabel = getRiskLabel(report.riskScore)

  const getStatusIcon = () => {
    switch (report.status) {
      case 'submitted':
        return <ClockIcon className="h-5 w-5 text-warning-500" />
      case 'received':
        return <ClockIcon className="h-5 w-5 text-primary-500" />
      case 'in_progress':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />
      case 'resolved':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (report.status) {
      case 'submitted':
        return '신고됨'
      case 'received':
        return '접수됨'
      case 'in_progress':
        return '처리중'
      case 'resolved':
        return '해결됨'
      case 'rejected':
        return '반려됨'
      default:
        return '알 수 없음'
    }
  }

  const getStatusColor = () => {
    switch (report.status) {
      case 'submitted':
        return 'warning'
      case 'received':
        return 'primary'
      case 'in_progress':
        return 'warning'
      case 'resolved':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI 위험도 분석</CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge variant={getStatusColor() as any}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 신고 이미지 */}
          <div className="relative">
            <img
              src={report.imageUrl}
              alt="신고 이미지"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              <Badge
                variant={report.urgency === 'high' ? 'danger' : report.urgency === 'medium' ? 'warning' : 'success'}
                animate
              >
                {report.urgency === 'high' ? '긴급' : report.urgency === 'medium' ? '보통' : '낮음'}
              </Badge>
            </div>
          </div>

          {/* 위험도 점수 */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold" style={{ color: riskColor }}>
              {report.riskScore}/10
            </div>
            <div className="text-gray-600">위험도: {riskLabel}</div>
            <ProgressBar
              value={report.riskScore * 10}
              variant={report.riskScore >= 7 ? 'danger' : report.riskScore >= 4 ? 'warning' : 'success'}
              size="lg"
            />
          </div>

          {/* AI 분석 결과 */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">분석 결과</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {report.aiAnalysis.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">권장 조치</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {report.aiAnalysis.recommendedAction}
              </p>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>신뢰도: {Math.round(report.aiAnalysis.confidence * 100)}%</span>
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">
              <div className="font-medium">신고 위치</div>
              <div>{report.location.address}</div>
            </div>
          </div>

          {/* 처리 상태 타임라인 */}
          {report.status !== 'submitted' && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">처리 현황</h4>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2" />
                  신고 완료 - {formatDate(report.createdAt)}
                </div>
                {report.status !== 'received' && (
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                    접수 완료 - {formatDate(report.updatedAt)}
                  </div>
                )}
                {report.status === 'in_progress' && (
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-2 h-2 bg-warning-500 rounded-full mr-2" />
                    처리중 - 유지보수팀 출동
                  </div>
                )}
                {report.status === 'resolved' && report.resolvedAt && (
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-2 h-2 bg-success-500 rounded-full mr-2" />
                    해결 완료 - {formatDate(report.resolvedAt)}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}