'use client'

import { motion } from 'framer-motion'
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { SafetyReport } from '@/types'
import { SAFETY_CATEGORIES } from '@/lib/constants'
import { getRiskColor, getRiskLabel, formatDate } from '@/lib/utils'

interface ReportListProps {
  reports: SafetyReport[]
  onReportClick?: (report: SafetyReport) => void
}

export default function ReportList({ reports, onReportClick }: ReportListProps) {
  const getStatusVariant = (status: SafetyReport['status']) => {
    switch (status) {
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

  const getStatusText = (status: SafetyReport['status']) => {
    switch (status) {
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

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ClockIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>아직 신고된 내용이 없습니다.</p>
        <p className="text-sm">첫 번째 안전 신고를 해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => {
        const category = SAFETY_CATEGORIES[report.category]
        const riskColor = getRiskColor(report.riskScore)
        const riskLabel = getRiskLabel(report.riskScore)

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hoverable
              className="cursor-pointer"
              onClick={() => onReportClick?.(report)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  {/* 신고 이미지 */}
                  <div className="flex-shrink-0">
                    <img
                      src={report.imageUrl}
                      alt="신고 이미지"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="text-center mt-1">
                      <div
                        className="text-xs font-bold"
                        style={{ color: riskColor }}
                      >
                        {report.riskScore}/10
                      </div>
                    </div>
                  </div>

                  {/* 신고 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <Badge
                        variant={getStatusVariant(report.status) as any}
                        size="sm"
                      >
                        {getStatusText(report.status)}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: riskColor }}
                        />
                        위험도: {riskLabel}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="truncate">
                          {report.location.address}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        {formatDate(report.createdAt)}
                      </div>
                    </div>

                    {/* AI 분석 요약 */}
                    {report.aiAnalysis.description && (
                      <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {report.aiAnalysis.description}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}