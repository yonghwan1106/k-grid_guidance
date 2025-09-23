'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { CommunityPost as CommunityPostType, User } from '@/types'
import { formatDate } from '@/lib/utils'

interface CommunityPostProps {
  post: CommunityPostType
  author: User
  currentUserId?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onPostClick?: (postId: string) => void
}

export default function CommunityPost({
  post,
  author,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onPostClick
}: CommunityPostProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()

    setIsLiked(!isLiked)
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post.id)
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    onComment?.(post.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare?.(post.id)
  }

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'report_share':
        return '📸'
      case 'mission_success':
        return '🎯'
      case 'tip_share':
        return '💡'
      case 'question':
        return '❓'
      default:
        return '📝'
    }
  }

  const getPostTypeLabel = () => {
    switch (post.type) {
      case 'report_share':
        return '신고 공유'
      case 'mission_success':
        return '미션 성공'
      case 'tip_share':
        return '팁 공유'
      case 'question':
        return '질문'
      default:
        return '일반'
    }
  }

  const getPostTypeColor = () => {
    switch (post.type) {
      case 'report_share':
        return 'danger'
      case 'mission_success':
        return 'success'
      case 'tip_share':
        return 'primary'
      case 'question':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        hoverable
        className="cursor-pointer"
        onClick={() => onPostClick?.(post.id)}
      >
        <CardContent className="p-4">
          {/* 헤더 */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-bold">
                  {author.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {author.name}
                </span>
                <Badge variant={getPostTypeColor() as any} size="sm">
                  {getPostTypeIcon()} {getPostTypeLabel()}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </h3>

          {/* 내용 */}
          <p className="text-gray-700 mb-3 line-clamp-3">
            {post.content}
          </p>

          {/* 이미지들 */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="mb-3">
              {post.imageUrls.length === 1 ? (
                <img
                  src={post.imageUrls[0]}
                  alt="포스트 이미지"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {post.imageUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`포스트 이미지 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {index === 3 && post.imageUrls!.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white font-semibold">
                          +{post.imageUrls!.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 태그들 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex space-x-4">
              <Button
                onClick={handleLike}
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{localLikes}</span>
              </Button>

              <Button
                onClick={handleComment}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-600"
              >
                <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                <span>{post.comments.length}</span>
              </Button>

              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-600"
              >
                <ShareIcon className="h-5 w-5" />
                <span>공유</span>
              </Button>
            </div>

            {/* 댓글 미리보기 */}
            {post.comments.length > 0 && (
              <div className="text-sm text-gray-600">
                댓글 {post.comments.length}개
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}