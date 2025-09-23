import { CommunityPost, Comment, User, ApiResponse } from '@/types'

// 커뮤니티 포스트 목록 조회
export async function getCommunityPosts(
  filter: 'all' | CommunityPost['type'] = 'all',
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<{
  posts: CommunityPost[]
  authors: Record<string, User>
  total: number
}>> {
  try {
    // 실제로는 데이터베이스에서 조회
    const mockData = generateMockPosts(limit, filter)
    const authors = generateMockAuthors(mockData.map(p => p.userId))

    return {
      success: true,
      data: {
        posts: mockData,
        authors,
        total: mockData.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '포스트 목록을 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 특정 포스트 조회
export async function getPostById(postId: string): Promise<ApiResponse<{
  post: CommunityPost
  author: User
  commentAuthors: Record<string, User>
}>> {
  try {
    // 실제로는 데이터베이스에서 조회
    const post = generateMockPost(postId)
    const author = generateMockUser(post.userId)
    const commentAuthors = generateMockAuthors(post.comments.map(c => c.userId))

    return {
      success: true,
      data: {
        post,
        author,
        commentAuthors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '포스트를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 새 포스트 생성
export async function createPost(
  userId: string,
  postData: {
    type: CommunityPost['type']
    title: string
    content: string
    imageFiles: File[]
    tags: string[]
  }
): Promise<ApiResponse<CommunityPost>> {
  try {
    // 이미지 업로드 처리
    const imageUrls = await uploadImages(postData.imageFiles)

    const post: CommunityPost = {
      id: generateId(),
      userId,
      type: postData.type,
      title: postData.title,
      content: postData.content,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      tags: postData.tags,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 실제로는 데이터베이스에 저장
    await savePostToDatabase(post)

    return {
      success: true,
      data: post,
      message: '게시글이 성공적으로 작성되었습니다.'
    }
  } catch (error) {
    return {
      success: false,
      error: '게시글 작성 중 오류가 발생했습니다.'
    }
  }
}

// 댓글 추가
export async function addComment(
  postId: string,
  userId: string,
  content: string
): Promise<ApiResponse<Comment>> {
  try {
    const comment: Comment = {
      id: generateId(),
      userId,
      content,
      likes: 0,
      createdAt: new Date()
    }

    // 실제로는 데이터베이스에 저장하고 포스트의 댓글 목록 업데이트
    await saveCommentToDatabase(postId, comment)

    return {
      success: true,
      data: comment,
      message: '댓글이 작성되었습니다.'
    }
  } catch (error) {
    return {
      success: false,
      error: '댓글 작성 중 오류가 발생했습니다.'
    }
  }
}

// 포스트 좋아요/좋아요 취소
export async function togglePostLike(
  postId: string,
  userId: string
): Promise<ApiResponse<{ isLiked: boolean; totalLikes: number }>> {
  try {
    // 실제로는 데이터베이스에서 좋아요 상태 확인 및 토글
    const isCurrentlyLiked = await checkIfUserLikedPost(postId, userId)
    const newLikeStatus = !isCurrentlyLiked

    if (newLikeStatus) {
      await addLikeToPost(postId, userId)
    } else {
      await removeLikeFromPost(postId, userId)
    }

    const totalLikes = await getPostLikesCount(postId)

    return {
      success: true,
      data: {
        isLiked: newLikeStatus,
        totalLikes
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '좋아요 처리 중 오류가 발생했습니다.'
    }
  }
}

// 팀 미션 관련 포스트 조회
export async function getTeamMissionPosts(
  teamMissionId: string
): Promise<ApiResponse<{
  posts: CommunityPost[]
  authors: Record<string, User>
}>> {
  try {
    // 특정 팀 미션과 관련된 포스트들 조회
    const posts = await getPostsByTeamMission(teamMissionId)
    const authors = generateMockAuthors(posts.map(p => p.userId))

    return {
      success: true,
      data: {
        posts,
        authors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '팀 미션 포스트를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 지역별 포스트 조회
export async function getLocalPosts(
  lat: number,
  lng: number,
  radius: number = 5000 // 미터
): Promise<ApiResponse<{
  posts: CommunityPost[]
  authors: Record<string, User>
}>> {
  try {
    // 지역 기반으로 포스트 조회
    const posts = await getPostsByLocation(lat, lng, radius)
    const authors = generateMockAuthors(posts.map(p => p.userId))

    return {
      success: true,
      data: {
        posts,
        authors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: '지역 포스트를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 유틸리티 함수들
async function uploadImages(files: File[]): Promise<string[]> {
  // 실제로는 클라우드 스토리지에 업로드
  return files.map((file, index) =>
    `https://example.com/community-images/${Date.now()}-${index}-${file.name}`
  )
}

async function savePostToDatabase(post: CommunityPost): Promise<void> {
  // 실제로는 데이터베이스에 저장
  console.log('Saving post to database:', post)
}

async function saveCommentToDatabase(postId: string, comment: Comment): Promise<void> {
  // 실제로는 데이터베이스에 저장
  console.log('Saving comment to database:', { postId, comment })
}

async function checkIfUserLikedPost(postId: string, userId: string): Promise<boolean> {
  // 실제로는 데이터베이스에서 확인
  return Math.random() > 0.5
}

async function addLikeToPost(postId: string, userId: string): Promise<void> {
  // 실제로는 데이터베이스에 좋아요 추가
  console.log('Adding like:', { postId, userId })
}

async function removeLikeFromPost(postId: string, userId: string): Promise<void> {
  // 실제로는 데이터베이스에서 좋아요 제거
  console.log('Removing like:', { postId, userId })
}

async function getPostLikesCount(postId: string): Promise<number> {
  // 실제로는 데이터베이스에서 좋아요 수 조회
  return Math.floor(Math.random() * 100)
}

async function getPostsByTeamMission(teamMissionId: string): Promise<CommunityPost[]> {
  // 실제로는 데이터베이스에서 팀 미션 관련 포스트 조회
  return generateMockPosts(5, 'mission_success')
}

async function getPostsByLocation(lat: number, lng: number, radius: number): Promise<CommunityPost[]> {
  // 실제로는 지리적 쿼리로 포스트 조회
  return generateMockPosts(10, 'all')
}

// 모의 데이터 생성 함수들
function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateMockUser(userId: string): User {
  const names = ['김철수', '박영희', '이민수', '정수진', '한지민', '최동욱', '송미라', '임재현']
  const randomName = names[Math.floor(Math.random() * names.length)]

  return {
    id: userId,
    name: randomName,
    email: `${userId}@example.com`,
    level: Math.floor(Math.random() * 5) + 1,
    points: Math.floor(Math.random() * 50000),
    badges: [],
    location: {
      lat: 37.5665 + (Math.random() - 0.5) * 0.1,
      lng: 126.9780 + (Math.random() - 0.5) * 0.1,
      address: `서울시 중구 ${Math.floor(Math.random() * 100)}번지`
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastActiveAt: new Date()
  }
}

function generateMockAuthors(userIds: string[]): Record<string, User> {
  const authors: Record<string, User> = {}

  userIds.forEach(id => {
    authors[id] = generateMockUser(id)
  })

  return authors
}

function generateMockPost(postId?: string): CommunityPost {
  const types: CommunityPost['type'][] = ['report_share', 'mission_success', 'tip_share', 'question']
  const type = types[Math.floor(Math.random() * types.length)]

  const titles = {
    report_share: [
      '우리 동네 기울어진 전신주 신고했어요',
      '변압기 주변 안전 문제 발견!',
      '나뭇가지가 전선에 닿을 것 같아요'
    ],
    mission_success: [
      '이번 달 에너지 20% 절약 성공!',
      '7일 연속 피크시간 절약 챌린지 완료',
      '대기전력 차단으로 월 5만원 절약'
    ],
    tip_share: [
      '여름철 에어컨 절약 꿀팁 공유',
      '스마트플러그로 대기전력 완전 차단하기',
      'LED 조명 교체 후 전기료 변화'
    ],
    question: [
      '태양광 패널 설치 문의드립니다',
      '에너지 효율 등급이 뭔가요?',
      '피크시간이 언제인지 궁금해요'
    ]
  }

  const contents = {
    report_share: '오늘 출근길에 발견한 위험요소입니다. AI 분석 결과 위험도 8점이 나왔어요. 빠른 조치가 필요할 것 같습니다.',
    mission_success: '드디어 목표를 달성했습니다! 가족들과 함께 노력한 결과예요. 다음 미션도 도전해볼 예정입니다.',
    tip_share: '실제로 해보니까 정말 효과가 있더라구요. 여러분도 한번 시도해보세요!',
    question: '혹시 경험 있으신 분들이나 전문가분들의 조언 부탁드립니다.'
  }

  const comments = Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => ({
    id: `comment_${i}`,
    userId: `user_${Math.floor(Math.random() * 20)}`,
    content: `댓글 내용 ${i + 1}`,
    likes: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }))

  return {
    id: postId || generateId(),
    userId: `user_${Math.floor(Math.random() * 20)}`,
    type,
    title: titles[type][Math.floor(Math.random() * titles[type].length)],
    content: contents[type],
    imageUrls: Math.random() > 0.5 ? [`https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`] : undefined,
    tags: ['에너지절약', '전력안전', '미션'].slice(0, Math.floor(Math.random() * 3) + 1),
    likes: Math.floor(Math.random() * 50),
    comments,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }
}

function generateMockPosts(
  count: number,
  filter: 'all' | CommunityPost['type']
): CommunityPost[] {
  return Array.from({ length: count }, () => {
    const post = generateMockPost()

    if (filter !== 'all') {
      post.type = filter
    }

    return post
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}