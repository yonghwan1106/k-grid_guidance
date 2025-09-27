'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import ReportForm from '@/components/safety/ReportForm'
import ReportList from '@/components/safety/ReportList'
import RiskAnalysis from '@/components/safety/RiskAnalysis'
import { SafetyReport, SafetyCategory } from '@/types'
import { useMissionStore } from '@/stores/missionStore'

type ViewMode = 'list' | 'form' | 'analysis'

export default function SafetyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [demoReports, setDemoReports] = useState<SafetyReport[]>([])

  const { safetyReports, addSafetyReport } = useMissionStore()

  useEffect(() => {
    // 프로토타입 모드: 데모 신고 데이터 생성
    const demoData: SafetyReport[] = [
      {
        id: 'demo-1',
        userId: 'demo-user',
        location: {
          lat: 37.5665,
          lng: 126.9780,
          address: '서울특별시 중구 명동2가'
        },
        category: 'tilting',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        description: '전신주가 약 15도 정도 기울어져 있습니다. 바람이 강한 날에는 더 위험해 보입니다.',
        riskScore: 8,
        urgency: 'high',
        status: 'in_progress',
        aiAnalysis: {
          description: '전력설비(전신주)가 상당히 기울어진 상태로 확인됩니다. 기울어진 각도가 15도 이상으로 보이며, 이는 구조적 안정성에 심각한 위험을 초래할 수 있습니다.',
          recommendedAction: '즉시 전력회사에 신고하여 긴급 점검 및 교체 작업을 요청하시기 바랍니다. 해당 지역 주민들의 접근을 제한하고 안전 조치가 필요합니다.',
          confidence: 0.92
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-2',
        userId: 'demo-user',
        location: {
          lat: 37.5547,
          lng: 126.9707,
          address: '서울특별시 영등포구 여의도동'
        },
        category: 'tree_contact',
        imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop&crop=center',
        description: '큰 나무 가지가 전력선에 닿아있어서 위험해 보입니다.',
        riskScore: 6,
        urgency: 'medium',
        status: 'received',
        aiAnalysis: {
          description: '수목의 가지가 고압 전력선에 직접 접촉하고 있는 상황입니다. 특히 비가 오거나 바람이 강한 날씨에는 전력 공급 중단이나 화재 위험이 높습니다.',
          recommendedAction: '1주일 내로 수목 전지 작업을 실시하여 전력선과의 접촉을 제거해야 합니다. 임시적으로 해당 구간의 전력 공급을 점검하는 것을 권장합니다.',
          confidence: 0.85
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-3',
        userId: 'demo-user',
        location: {
          lat: 37.4979,
          lng: 127.0276,
          address: '서울특별시 강남구 역삼동'
        },
        category: 'equipment_damage',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
        description: '전력 변압기 외관에 손상이 있고 기름이 새고 있는 것 같습니다.',
        riskScore: 9,
        urgency: 'high',
        status: 'resolved',
        aiAnalysis: {
          description: '변압기 외관에 균열이 발생하여 절연유가 누출되고 있는 상태입니다. 이는 매우 심각한 안전 위험을 초래하며 즉시 조치가 필요한 상황입니다.',
          recommendedAction: '즉시 해당 구역의 전력 공급을 차단하고 전문 기술진의 긴급 출동이 필요합니다. 주변 지역 대피 및 화재 예방 조치를 취해야 합니다.',
          confidence: 0.94
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
        resolvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: 'demo-4',
        userId: 'demo-user',
        location: {
          lat: 37.5172,
          lng: 127.0473,
          address: '서울특별시 강남구 삼성동'
        },
        category: 'other',
        imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop&crop=center',
        description: '지하 전력 케이블 맨홀 뚜껑이 파손되어 내부가 노출되어 있습니다.',
        riskScore: 5,
        urgency: 'medium',
        status: 'submitted',
        aiAnalysis: {
          description: '지하 전력설비 접근구의 덮개가 손상되어 내부 전력 케이블이 외부에 노출된 상태입니다. 직접적인 전기 위험은 낮으나 보안상 문제가 있습니다.',
          recommendedAction: '2주 내로 맨홀 뚜껑 교체 작업을 실시하고, 임시적으로 안전 펜스 설치를 권장합니다. 보행자 안전에 주의가 필요합니다.',
          confidence: 0.78
        },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
    setDemoReports(demoData)
  }, [])

  const handleFormSubmit = async (data: {
    imageFile: File
    category: SafetyCategory
    location: { lat: number; lng: number; address: string }
    description: string
  }) => {
    setIsSubmitting(true)

    try {
      // 이미지를 Base64로 변환
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // data:image/jpeg;base64, 부분 제거
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(data.imageFile)
      })

      // Claude API 호출
      const response = await fetch('/api/analyze-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          category: data.category,
          location: data.location,
          description: data.description
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'AI 분석에 실패했습니다.')
      }

      const analysisResult = result.data

      // 업로드된 이미지를 URL로 변환
      const imageUrl = URL.createObjectURL(data.imageFile)

      const newReport: SafetyReport = {
        id: `report-${Date.now()}`,
        userId: 'demo-user',
        location: data.location,
        category: data.category,
        imageUrl: imageUrl,
        description: data.description,
        riskScore: analysisResult.riskScore,
        urgency: analysisResult.urgency,
        status: 'submitted',
        aiAnalysis: {
          description: analysisResult.description,
          recommendedAction: analysisResult.recommendedAction,
          confidence: analysisResult.confidence
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // 데모 리포트 목록에 추가
      setDemoReports(prev => [newReport, ...prev])

      console.log('신고 제출 완료:', newReport.description, `+${analysisResult.riskScore * 50}P`)

      // 분석 결과 화면으로 이동
      setSelectedReport(newReport)
      setViewMode('analysis')
    } catch (error) {
      console.error('신고 제출 실패:', error)
      alert('AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.')
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
                reports={demoReports}
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