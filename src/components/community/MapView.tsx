'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import KakaoMap from '@/components/maps/KakaoMap'
import { SafetyReport } from '@/types'
import { getNearbyReports } from '@/lib/api/safety'
import { getCurrentPosition } from '@/lib/kakao'

interface MapViewProps {
  onReportClick?: (report: SafetyReport) => void
}

export default function MapView({ onReportClick }: MapViewProps) {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }) // 서울 시청
  const [reports, setReports] = useState<SafetyReport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

  useEffect(() => {
    loadCurrentLocation()
    loadNearbyReports()
  }, [])

  const loadCurrentLocation = async () => {
    try {
      const position = await getCurrentPosition()
      setCenter(position)
    } catch (error) {
      console.error('현재 위치 가져오기 실패:', error)
    }
  }

  const loadNearbyReports = async () => {
    setIsLoading(true)
    try {
      const response = await getNearbyReports(center.lat, center.lng, 5000)
      if (response.success && response.data) {
        setReports(response.data)
      }
    } catch (error) {
      console.error('주변 신고 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true
    if (filter === 'active') return report.status !== 'resolved'
    if (filter === 'resolved') return report.status === 'resolved'
    return true
  })

  // 지도 마커 데이터 생성
  const markers = filteredReports.map(report => ({
    id: report.id,
    position: {
      lat: report.location.lat,
      lng: report.location.lng
    },
    title: `${report.category} - 위험도 ${report.riskScore}/10`,
    type: report.status === 'resolved' ? 'resolved_issue' : 'safety_report' as const,
    data: report,
    riskScore: report.riskScore
  }))

  const handleMarkerClick = (marker: any) => {
    if (onReportClick) {
      onReportClick(marker.data)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPinIcon className="h-6 w-6" />
                <span>지역 현황 지도</span>
              </CardTitle>
              <Button
                onClick={loadNearbyReports}
                size="sm"
                isLoading={isLoading}
              >
                새로고침
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* 필터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-2"
      >
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <div className="flex space-x-2">
          {[
            { value: 'all', label: '전체', count: reports.length },
            { value: 'active', label: '처리중', count: reports.filter(r => r.status !== 'resolved').length },
            { value: 'resolved', label: '해결됨', count: reports.filter(r => r.status === 'resolved').length }
          ].map((filterOption) => (
            <Button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value as any)}
              variant={filter === filterOption.value ? 'primary' : 'secondary'}
              size="sm"
            >
              {filterOption.label} ({filterOption.count})
            </Button>
          ))}
        </div>
      </motion.div>

      {/* 지도 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <KakaoMap
              center={center}
              markers={markers}
              onMarkerClick={handleMarkerClick}
              height="500px"
              level={4}
              showControls={true}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 범례 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>범례</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  !
                </div>
                <span className="text-sm">신고된 위험요소</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
                <span className="text-sm">해결된 문제</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  T
                </div>
                <span className="text-sm">팀 미션</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-600">
              <p>• 마커를 클릭하면 상세 정보를 볼 수 있습니다</p>
              <p>• 위험도가 높을수록 빨간색으로 표시됩니다</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}