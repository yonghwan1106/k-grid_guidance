import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // 환경변수 체크
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'Claude API key is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { imageBase64, category, location, description } = body

    console.log('Request received:', {
      category,
      location,
      description,
      hasImage: !!imageBase64,
      imageLength: imageBase64?.length
    })

    // 이미지 타입 감지
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg' // 기본값
    if (imageBase64) {
      // Base64 헤더를 통한 이미지 타입 감지
      if (imageBase64.startsWith('/9j/')) mediaType = 'image/jpeg'
      else if (imageBase64.startsWith('iVBORw0KGgo')) mediaType = 'image/png'
      else if (imageBase64.startsWith('R0lGODlh')) mediaType = 'image/gif'
      else if (imageBase64.startsWith('UklGR')) mediaType = 'image/webp'
    }

    console.log('Detected media type:', mediaType)

    // Claude API를 통한 이미지 분석
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241220',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `전력설비 안전 위험도를 분석해주세요.

위치: ${location.address}
분류: ${category}
추가 설명: ${description || '없음'}

다음 형식으로 JSON 응답을 생성해주세요:
{
  "riskScore": 1-10 사이의 숫자,
  "urgency": "low" | "medium" | "high",
  "description": "위험 상황에 대한 상세한 설명",
  "recommendedAction": "권장 조치사항",
  "confidence": 0-1 사이의 신뢰도
}

분석 기준:
- 1-3점: 낮은 위험 (정기 점검 시 처리)
- 4-6점: 보통 위험 (1주일 내 점검 필요)
- 7-10점: 높은 위험 (즉시 조치 필요)

전력설비의 기울어짐, 파손, 수목 접촉, 절연체 손상 등을 중점적으로 분석해주세요.`
            }
          ]
        }
      ]
    })

    // Claude 응답에서 JSON 추출
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    console.log('Claude 응답 원문:', responseText)

    // JSON 파싱 시도
    let analysisResult
    try {
      // 1. JSON 블록 추출 (```json ... ``` 형태)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        console.log('JSON 블록 발견:', jsonMatch[1])
        analysisResult = JSON.parse(jsonMatch[1].trim())
      } else {
        // 2. 중괄호로 둘러싸인 JSON 찾기
        const braceMatch = responseText.match(/\{[\s\S]*\}/)
        if (braceMatch) {
          console.log('중괄호 JSON 발견:', braceMatch[0])
          analysisResult = JSON.parse(braceMatch[0])
        } else {
          // 3. 직접 JSON 파싱 시도
          analysisResult = JSON.parse(responseText.trim())
        }
      }

      // 필수 필드 확인 및 기본값 설정
      analysisResult = {
        riskScore: analysisResult.riskScore || 5,
        urgency: analysisResult.urgency || 'medium',
        description: analysisResult.description || '전력설비 안전 위험 요소가 분석되었습니다.',
        recommendedAction: analysisResult.recommendedAction || '전문가의 현장 점검을 권장합니다.',
        confidence: analysisResult.confidence || 0.7
      }

    } catch (parseError) {
      // 파싱 실패 시 기본값 사용
      console.error('JSON 파싱 실패:', parseError)
      console.error('응답 내용:', responseText)
      analysisResult = {
        riskScore: 5,
        urgency: 'medium',
        description: '이미지 분석이 완료되었으나 상세 분석 결과를 파싱하는 중 오류가 발생했습니다.',
        recommendedAction: '전문가의 현장 점검을 권장합니다.',
        confidence: 0.7
      }
    }

    return NextResponse.json({
      success: true,
      data: analysisResult
    })

  } catch (error) {
    console.error('Claude API 호출 실패:', error)
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      status: (error as any)?.status,
      code: (error as any)?.code
    })

    // Claude API 실패 시 시뮬레이션 결과 반환
    console.log('Claude API 실패, 시뮬레이션 모드로 전환')
    return NextResponse.json({
      success: true,
      data: {
        riskScore: Math.floor(Math.random() * 8) + 3, // 3-10 범위
        urgency: 'medium' as const,
        description: '시뮬레이션 모드: 전력설비에서 안전 위험 요소가 감지되었습니다. 실제 AI 분석은 일시적으로 사용할 수 없습니다.',
        recommendedAction: '현장 점검을 통해 정확한 위험도를 확인하고 필요시 전문가에게 문의하시기 바랍니다.',
        confidence: 0.7
      },
      simulation: true
    })
  }
}