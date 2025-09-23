'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  PaperAirplaneIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { CommunityPost, Comment, User } from '@/types'
import { formatDate } from '@/lib/utils'
import { getPostById, addComment } from '@/lib/api/community'

interface PostDetailProps {
  postId: string
  currentUser?: User
  onBack?: () => void
}

export default function PostDetail({ postId, currentUser, onBack }: PostDetailProps) {
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [author, setAuthor] = useState<User | null>(null)
  const [commentAuthors, setCommentAuthors] = useState<Record<string, User>>({})
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(0)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const response = await getPostById(postId)
      if (response.success && response.data) {
        setPost(response.data.post)
        setAuthor(response.data.author)
        setCommentAuthors(response.data.commentAuthors || {})
        setLocalLikes(response.data.post.likes)
      }
    } catch (error) {
      console.error('포스트 로드 실패:', error)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1)
    // 실제로는 API 호출
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser || !post) return

    setIsSubmitting(true)
    try {
      const response = await addComment(post.id, currentUser.id, newComment)
      if (response.success && response.data) {
        setPost(prev => prev ? {
          ...prev,
          comments: [...prev.comments, response.data!]
        } : null)
        setCommentAuthors(prev => ({
          ...prev,
          [currentUser.id]: currentUser
        }))
        setNewComment('')
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!post || !author) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    )
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 뒤로가기 버튼 */}
      {onBack && (
        <Button onClick={onBack} variant="secondary">
          ← 목록으로 돌아가기
        </Button>
      )}

      {/* 메인 포스트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {author.name}
                  </span>
                  <Badge variant={getPostTypeColor() as any}>
                    {getPostTypeIcon()} {getPostTypeLabel()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDate(post.createdAt, 'long')}</span>
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl mt-4">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 본문 */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* 이미지들 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="space-y-2">
                {post.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`포스트 이미지 ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* 태그들 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleLike}
                variant="ghost"
                className={`flex items-center space-x-2 ${
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

              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600">
                <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                <span>{post.comments.length}</span>
              </Button>

              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600">
                <ShareIcon className="h-5 w-5" />
                <span>공유</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 댓글 작성 */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold">
                      {currentUser.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      isLoading={isSubmitting}
                      size="sm"
                    >
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 댓글 목록 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>댓글 {post.comments.length}개</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                첫 번째 댓글을 작성해보세요!
              </div>
            ) : (
              post.comments.map((comment, index) => {
                const commentAuthor = commentAuthors[comment.userId]

                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {commentAuthor?.avatarUrl ? (
                        <img
                          src={commentAuthor.avatarUrl}
                          alt={commentAuthor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-sm font-bold">
                          {commentAuthor?.name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {commentAuthor?.name || '알 수 없음'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="text-xs text-gray-500 hover:text-red-600 flex items-center space-x-1">
                          <HeartIcon className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}