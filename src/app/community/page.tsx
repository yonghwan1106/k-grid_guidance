'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CommunityFeed from '@/components/community/CommunityFeed'
import PostDetail from '@/components/community/PostDetail'
import CreatePostModal from '@/components/community/CreatePostModal'
import { createPost } from '@/lib/api/community'
type ViewMode = 'feed' | 'detail'

export default function CommunityPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('feed')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId)
    setViewMode('detail')
  }

  const handleBackToFeed = () => {
    setViewMode('feed')
    setSelectedPostId(null)
  }

  const handleCreatePost = async (postData: {
    type: any
    title: string
    content: string
    imageFiles: File[]
    tags: string[]
  }) => {
    setIsSubmitting(true)
    try {
      // 프로토타입 모드: 포스트 생성 시뮬레이션
      console.log('포스트 생성:', postData.title)
      setIsCreateModalOpen(false)
      // 피드 새로고침을 위해 상태 업데이트 트리거
      window.location.reload()
    } catch (error) {
      console.error('포스트 생성 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            커뮤니티
          </h1>
          <p className="text-gray-600">
            이웃과 함께 안전하고 효율적인 에너지 미래를 만들어가세요
          </p>
        </motion.header>

        {/* 컨텐츠 */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'feed' && (
            <div className="max-w-4xl mx-auto">
              <CommunityFeed
                currentUser={undefined}
                onCreatePost={() => setIsCreateModalOpen(true)}
                onPostClick={handlePostClick}
              />
            </div>
          )}

          {viewMode === 'detail' && selectedPostId && (
            <PostDetail
              postId={selectedPostId}
              currentUser={undefined}
              onBack={handleBackToFeed}
            />
          )}
        </motion.div>

        {/* 게시글 작성 모달 */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
          isLoading={isSubmitting}
        />

        {/* 프로토타입 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 max-w-sm"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">🏆 데모 모드</h3>
            <p className="text-sm opacity-90">
              KDN 파워업 챌린지 2025 프로토타입
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}