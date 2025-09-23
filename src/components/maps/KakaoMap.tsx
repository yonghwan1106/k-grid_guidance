'use client'

import { useEffect, useState } from 'react'
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk'
import { SafetyReport } from '@/types'
import { getRiskColor } from '@/lib/utils'

interface MapMarkerData {
  id: string
  position: {
    lat: number
    lng: number
  }
  title: string
  type: 'safety_report' | 'resolved_issue' | 'team_mission'
  data: SafetyReport | any
  riskScore?: number
}

interface KakaoMapProps {
  center: {
    lat: number
    lng: number
  }
  markers?: MapMarkerData[]
  onMarkerClick?: (marker: MapMarkerData) => void
  height?: string
  level?: number
  showControls?: boolean
}

export default function KakaoMap({
  center,
  markers = [],
  onMarkerClick,
  height = '400px',
  level = 3,
  showControls = true
}: KakaoMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Kakao Maps SDK 로드 확인
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true)
      } else {
        // SDK가 로드되지 않았으면 스크립트 동적 로드
        const script = document.createElement('script')
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`
        script.async = true

        script.onload = () => {
          window.kakao.maps.load(() => {
            setIsLoaded(true)
          })
        }

        document.head.appendChild(script)
      }
    }

    checkKakaoMaps()
  }, [])

  if (!isLoaded) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">지도 로딩 중...</p>
        </div>
      </div>
    )
  }

  // 마커 아이콘 생성
  const createMarkerImage = (type: string, riskScore?: number) => {
    let imageSrc = ''
    let imageSize = { width: 24, height: 35 }

    switch (type) {
      case 'safety_report':
        if (riskScore) {
          const color = getRiskColor(riskScore)
          // 위험도에 따른 색상 마커
          imageSrc = `data:image/svg+xml;base64,${btoa(`
            <svg width="24" height="35" viewBox="0 0 24 35" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
              <circle cx="12" cy="9" r="3" fill="white"/>
              <text x="12" y="13" text-anchor="middle" fill="${color}" font-size="8" font-weight="bold">${riskScore}</text>
            </svg>
          `)}`
        } else {
          imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
        }
        break
      case 'resolved_issue':
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png'
        break
      case 'team_mission':
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_green.png'
        break
      default:
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
    }

    return {
      src: imageSrc,
      size: imageSize,
      options: {
        offset: {
          x: 12,
          y: 35
        }
      }
    }
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={level}
      >
        {/* 지도 컨트롤 */}
        {showControls && (
          <>
            <MapTypeControl position="TOPRIGHT" />
            <ZoomControl position="RIGHT" />
          </>
        )}

        {/* 마커들 */}
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            image={createMarkerImage(marker.type, marker.riskScore)}
            onClick={() => onMarkerClick?.(marker)}
          />
        ))}
      </Map>
    </div>
  )
}