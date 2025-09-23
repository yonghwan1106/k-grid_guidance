'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MapView from '@/components/community/MapView'
import RiskAnalysis from '@/components/safety/RiskAnalysis'
import { SafetyReport } from '@/types'

export default function MapPage() {
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null)

  const handleReportClick = (report: SafetyReport) => {
    setSelectedReport(report)
  }

  const handleBackToMap = () => {
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
            실시간 현황 지도
          </h1>
          <p className="text-gray-600">
            우리 지역의 전력설비 현황을 한눈에 확인하세요
          </p>
        </motion.header>

        {/* 컨텐츠 */}
        {selectedReport ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToMap}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← 지도로 돌아가기
              </button>
            </div>
            <RiskAnalysis report={selectedReport} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <MapView onReportClick={handleReportClick} />
          </div>
        )}
      </div>
    </div>
  )
}