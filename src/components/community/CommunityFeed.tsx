'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import CommunityPost from './CommunityPost'
import { CommunityPost as CommunityPostType, User } from '@/types'
import { getCommunityPosts } from '@/lib/api/community'

interface CommunityFeedProps {
  currentUser?: User
  onCreatePost?: () => void
  onPostClick?: (postId: string) => void
}

export default function CommunityFeed({
  currentUser,
  onCreatePost,
  onPostClick
}: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPostType[]>([])
  const [authors, setAuthors] = useState<Record<string, User>>({})
  const [filter, setFilter] = useState<'all' | 'report_share' | 'mission_success' | 'tip_share' | 'question'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [filter])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const response = await getCommunityPosts(filter, 20)
      if (response.success && response.data) {
        setPosts(response.data.posts)
        setAuthors(response.data.authors)
      }
    } catch (error) {
      console.error('포스트 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    // 실제로는 API 호출하여 좋아요 처리
    console.log('Like post:', postId)
  }

  const handleComment = (postId: string) => {
    onPostClick?.(postId)
  }

  const handleShare = (postId: string) => {
    // 실제로는 공유 기능 구현
    console.log('Share post:', postId)
  }

  const getFilterLabel = (filterType: typeof filter) => {
    switch (filterType) {
      case 'all':
        return '전체'
      case 'report_share':
        return '신고 공유'
      case 'mission_success':
        return '미션 성공'
      case 'tip_share':
        return '팁 공유'
      case 'question':
        return '질문'
      default:
        return '전체'
    }
  }

  const getFilterIcon = (filterType: typeof filter) => {
    switch (filterType) {
      case 'report_share':
        return '📸'
      case 'mission_success':
        return '🎯'
      case 'tip_share':
        return '💡'
      case 'question':
        return '❓'
      default:
        return '📋'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          커뮤니티 피드
        </h2>
        <Button
          onClick={onCreatePost}
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          게시글 작성
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <FunnelIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
        {(['all', 'report_share', 'mission_success', 'tip_share', 'question'] as const).map((filterType) => (
          <Button
            key={filterType}
            onClick={() => setFilter(filterType)}
            variant={filter === filterType ? 'primary' : 'secondary'}
            size="sm"
            className="flex-shrink-0"
          >
            {getFilterIcon(filterType)} {getFilterLabel(filterType)}
          </Button>
        ))}
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              아직 게시글이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째 게시글을 작성해보세요!
            </p>
            <Button onClick={onCreatePost}>
              게시글 작성하기
            </Button>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CommunityPost
                post={post}
                author={authors[post.userId]}
                currentUserId={currentUser?.id}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onPostClick={onPostClick}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* 더 보기 버튼 */}
      {posts.length >= 20 && (
        <div className="text-center">
          <Button
            onClick={loadPosts}
            variant="secondary"
            isLoading={isLoading}
          >
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}