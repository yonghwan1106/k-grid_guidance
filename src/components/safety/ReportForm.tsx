'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { CameraIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SAFETY_CATEGORIES } from '@/lib/constants'
import { SafetyCategory } from '@/types'
import { compressImage, getAddressFromCoords } from '@/lib/utils'

interface ReportFormProps {
  onSubmit: (data: {
    imageFile: File
    category: SafetyCategory
    location: { lat: number; lng: number; address: string }
    description: string
  }) => void
  isLoading?: boolean
}

export default function ReportForm({ onSubmit, isLoading = false }: ReportFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<SafetyCategory | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [description, setDescription] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const compressedFile = await compressImage(file)
      setImageFile(compressedFile)
      setImagePreview(URL.createObjectURL(compressedFile))
    } catch (error) {
      console.error('이미지 압축 실패:', error)
    }
  }

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)

    try {
      // Kakao 라이브러리에서 현재 위치 가져오기
      const { getCurrentPosition } = await import('@/lib/kakao')
      const position = await getCurrentPosition()
      const address = await getAddressFromCoords(position.lat, position.lng)

      setLocation({
        lat: position.lat,
        lng: position.lng,
        address
      })
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error)
      // 폴백: 기본 위치 (서울 시청)
      setLocation({
        lat: 37.5665,
        lng: 126.9780,
        address: '서울특별시 중구 세종대로 110'
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = () => {
    if (!imageFile || !selectedCategory || !location) return

    onSubmit({
      imageFile,
      category: selectedCategory,
      location,
      description
    })
  }

  const isFormValid = imageFile && selectedCategory && location

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">안전 신고하기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 촬영
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors ${
              imagePreview ? 'border-primary-500' : ''
            }`}
          >
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600">다시 촬영하려면 클릭하세요</p>
              </div>
            ) : (
              <div className="space-y-2">
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">사진을 촬영하거나 선택하세요</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* 위험 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            위험 종류
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(SAFETY_CATEGORIES).map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id as SafetyCategory)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  selectedCategory === category.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 위치 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            위치 정보
          </label>
          {location ? (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                <span>{location.address}</span>
              </div>
            </div>
          ) : (
            <Button
              onClick={getCurrentLocation}
              isLoading={isGettingLocation}
              variant="secondary"
              className="w-full"
            >
              <MapPinIcon className="h-4 w-4 mr-2" />
              현재 위치 가져오기
            </Button>
          )}
        </div>

        {/* 상세 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세 설명 (선택사항)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="추가적인 위험 요소나 특이사항을 입력하세요..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* 제출 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          AI 분석 요청하기
        </Button>
      </CardContent>
    </Card>
  )
}