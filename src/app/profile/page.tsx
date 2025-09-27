// 프로토타입 버전에서는 프로필 페이지가 제거되었습니다.
// 대신 홈페이지로 리다이렉트합니다.

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          프로토타입 모드
        </h2>
        <p className="text-gray-600">프로필 기능은 프로토타입에서 제외되었습니다.</p>
      </div>
    </div>
  )
}