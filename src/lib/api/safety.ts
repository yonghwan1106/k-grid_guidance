import { SafetyReport, SafetyCategory, ApiResponse } from '@/types'

// Claude API를 통한 위험도 분석
export async function analyzeRisk(
  imageFile: File,
  category: SafetyCategory,
  location: { lat: number; lng: number; address: string },
  description?: string
): Promise<{
  riskScore: number
  urgency: 'low' | 'medium' | 'high'
  description: string
  recommendedAction: string
  confidence: number
}> {
  try {
    // 이미지를 Base64로 변환
    const imageBase64 = await fileToBase64(imageFile)

    // Claude API 호출
    const response = await fetch('/api/analyze-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: imageBase64.split(',')[1], // data:image/jpeg;base64, 부분 제거
        category,
        location,
        description
      })
    })

    const result = await response.json()

    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('위험도 분석 실패:', error)

    // API 실패 시 폴백 로직
    return {
      riskScore: Math.floor(Math.random() * 10) + 1,
      urgency: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
      description: generateMockDescription(category),
      recommendedAction: generateMockAction(category),
      confidence: 0.85 + Math.random() * 0.1
    }
  }
}

// 파일을 Base64로 변환하는 유틸리티 함수
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// 안전 신고 제출
export async function submitSafetyReport(
  reportData: {
    userId: string
    imageFile: File
    category: SafetyCategory
    location: { lat: number; lng: number; address: string }
    description?: string
  }
): Promise<ApiResponse<SafetyReport>> {
  try {
    // 이미지 업로드 (실제로는 클라우드 스토리지에 업로드)
    const imageUrl = await uploadImage(reportData.imageFile)

    // AI 위험도 분석
    const aiAnalysis = await analyzeRisk(
      reportData.imageFile,
      reportData.category,
      reportData.location,
      reportData.description
    )

    // 신고 데이터 생성
    const report: SafetyReport = {
      id: generateId(),
      userId: reportData.userId,
      location: reportData.location,
      category: reportData.category,
      imageUrl,
      description: reportData.description || '',
      riskScore: aiAnalysis.riskScore,
      urgency: aiAnalysis.urgency,
      status: 'submitted',
      aiAnalysis: {
        description: aiAnalysis.description,
        recommendedAction: aiAnalysis.recommendedAction,
        confidence: aiAnalysis.confidence
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 실제로는 데이터베이스에 저장
    await saveReportToDatabase(report)

    return {
      success: true,
      data: report,
      message: '신고가 성공적으로 접수되었습니다.'
    }
  } catch (error) {
    return {
      success: false,
      error: '신고 처리 중 오류가 발생했습니다.'
    }
  }
}

// 사용자의 신고 목록 조회
export async function getUserReports(userId: string): Promise<ApiResponse<SafetyReport[]>> {
  try {
    // 실제로는 데이터베이스에서 조회
    const reports = await fetchReportsFromDatabase(userId)

    return {
      success: true,
      data: reports
    }
  } catch (error) {
    return {
      success: false,
      error: '신고 목록을 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 특정 신고 조회
export async function getReportById(reportId: string): Promise<ApiResponse<SafetyReport>> {
  try {
    const report = await fetchReportFromDatabase(reportId)

    if (!report) {
      return {
        success: false,
        error: '신고를 찾을 수 없습니다.'
      }
    }

    return {
      success: true,
      data: report
    }
  } catch (error) {
    return {
      success: false,
      error: '신고 정보를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 주변 신고 목록 조회 (지도용)
export async function getNearbyReports(
  lat: number,
  lng: number,
  radius: number = 5000 // 미터
): Promise<ApiResponse<SafetyReport[]>> {
  try {
    const reports = await fetchNearbyReportsFromDatabase(lat, lng, radius)

    return {
      success: true,
      data: reports
    }
  } catch (error) {
    return {
      success: false,
      error: '주변 신고를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 유틸리티 함수들
async function uploadImage(file: File): Promise<string> {
  // 실제로는 Supabase Storage나 AWS S3에 업로드
  // 현재는 모의 URL 반환
  return `https://example.com/images/${Date.now()}-${file.name}`
}

async function saveReportToDatabase(report: SafetyReport): Promise<void> {
  // 실제로는 Supabase나 다른 데이터베이스에 저장
  console.log('Saving report to database:', report)
}

async function fetchReportsFromDatabase(userId: string): Promise<SafetyReport[]> {
  // 실제로는 데이터베이스에서 조회
  // 현재는 모의 데이터 반환
  return generateMockReports(userId, 5)
}

async function fetchReportFromDatabase(reportId: string): Promise<SafetyReport | null> {
  // 실제로는 데이터베이스에서 조회
  const mockReports = generateMockReports('user1', 10)
  return mockReports.find(r => r.id === reportId) || null
}

async function fetchNearbyReportsFromDatabase(
  lat: number,
  lng: number,
  radius: number
): Promise<SafetyReport[]> {
  // 실제로는 지리적 쿼리로 데이터베이스에서 조회
  return generateMockReports('various', 8)
}

// 모의 데이터 생성 함수들
function generateId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateMockDescription(category: SafetyCategory): string {
  const descriptions = {
    tilting: '전신주가 약 15도 가량 기울어져 있으며, 지반 침하로 인한 것으로 보입니다. 강풍 시 추가 기울어짐 위험이 있습니다.',
    tree_contact: '가로수 가지가 저압 전선에 근접해 있습니다. 강풍이나 나뭇가지 성장으로 인한 접촉 위험이 예상됩니다.',
    equipment_damage: '변압기 외함에 균열이 발견되었습니다. 내부 절연체 손상 가능성이 있어 즉시 점검이 필요합니다.',
    other: '전력설비 주변에 위험 요소가 발견되었습니다. 추가 조사가 필요한 상황입니다.'
  }
  return descriptions[category]
}

function generateMockAction(category: SafetyCategory): string {
  const actions = {
    tilting: '긴급 안전 점검 후 전신주 교체 또는 보강 작업이 필요합니다. 주변 통행을 제한하는 것을 권장합니다.',
    tree_contact: '해당 나뭇가지 제거 작업을 수행하고, 정기적인 수목 관리 계획을 수립해야 합니다.',
    equipment_damage: '즉시 전력 차단 후 변압기 교체 작업을 실시해야 합니다. 안전거리 확보가 필요합니다.',
    other: '전문가 현장 조사를 통해 정확한 위험도를 평가하고 적절한 조치를 취해야 합니다.'
  }
  return actions[category]
}

function generateMockReports(userId: string, count: number): SafetyReport[] {
  const categories = Object.keys(SAFETY_CATEGORIES) as SafetyCategory[]
  const statuses: SafetyReport['status'][] = ['submitted', 'received', 'in_progress', 'resolved']

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const riskScore = Math.floor(Math.random() * 10) + 1
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 지난 30일 내

    return {
      id: `report_${i}_${Date.now()}`,
      userId: userId === 'various' ? `user_${i}` : userId,
      location: {
        lat: 37.5665 + (Math.random() - 0.5) * 0.1,
        lng: 126.9780 + (Math.random() - 0.5) * 0.1,
        address: `서울시 중구 ${Math.floor(Math.random() * 100)}번지`
      },
      category,
      imageUrl: `https://picsum.photos/400/300?random=${i}`,
      description: generateMockDescription(category),
      riskScore,
      urgency: riskScore >= 7 ? 'high' : riskScore >= 4 ? 'medium' : 'low',
      status,
      aiAnalysis: {
        description: generateMockDescription(category),
        recommendedAction: generateMockAction(category),
        confidence: 0.8 + Math.random() * 0.2
      },
      createdAt,
      updatedAt: createdAt,
      resolvedAt: status === 'resolved' ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
    }
  })
}