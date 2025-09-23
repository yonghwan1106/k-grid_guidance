'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, PhotoIcon, HashtagIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CommunityPost } from '@/types'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (postData: {
    type: CommunityPost['type']
    title: string
    content: string
    imageFiles: File[]
    tags: string[]
  }) => void
  isLoading?: boolean
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: CreatePostModalProps) {
  const [postType, setPostType] = useState<CommunityPost['type']>('tip_share')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setPostType('tip_share')
    setTitle('')
    setContent('')
    setImageFiles([])
    setImagePreviews([])
    setTags([])
    setTagInput('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImageFiles = [...imageFiles, ...files].slice(0, 4) // 최대 4개
    const newPreviews = [...imagePreviews]

    files.forEach((file) => {
      if (newPreviews.length < 4) {
        newPreviews.push(URL.createObjectURL(file))
      }
    })

    setImageFiles(newImageFiles)
    setImagePreviews(newPreviews.slice(0, 4))
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)

    // 메모리 정리
    URL.revokeObjectURL(imagePreviews[index])

    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleTagAdd()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return

    onSubmit({
      type: postType,
      title: title.trim(),
      content: content.trim(),
      imageFiles,
      tags
    })

    resetForm()
  }

  const postTypes = [
    { value: 'tip_share', label: '팁 공유', icon: '💡', description: '유용한 에너지 절약 팁을 공유하세요' },
    { value: 'mission_success', label: '미션 성공', icon: '🎯', description: '완료한 미션의 경험을 공유하세요' },
    { value: 'report_share', label: '신고 공유', icon: '📸', description: '안전 신고 경험을 공유하세요' },
    { value: 'question', label: '질문', icon: '❓', description: '궁금한 점을 물어보세요' }
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>새 게시글 작성</CardTitle>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 게시글 유형 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    게시글 유형
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {postTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setPostType(type.value)}
                        className={`p-3 text-left border-2 rounded-lg transition-colors ${
                          postType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {title.length}/100
                  </div>
                </div>

                {/* 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={6}
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {content.length}/1000
                  </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 (최대 4개)
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">이미지를 선택하세요</p>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`미리보기 ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    태그 (최대 5개)
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <HashtagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="태그를 입력하세요"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          maxLength={20}
                          disabled={tags.length >= 5}
                        />
                      </div>
                      <Button
                        onClick={handleTagAdd}
                        disabled={!tagInput.trim() || tags.length >= 5}
                        size="sm"
                      >
                        추가
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleClose}
                    variant="secondary"
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim()}
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    게시하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}