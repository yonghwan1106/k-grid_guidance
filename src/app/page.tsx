'use client'

import { motion } from 'framer-motion'
import { ShieldCheckIcon, BoltIcon, TrophyIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: '그리드 워치',
      description: '전력설비 위험요소를 신고하고 AI가 즉시 분석',
      color: 'text-primary-600'
    },
    {
      icon: BoltIcon,
      title: '세이버 퀘스트',
      description: '개인화된 에너지 절약 미션으로 효율 개선',
      color: 'text-success-600'
    },
    {
      icon: TrophyIcon,
      title: '게이미피케이션',
      description: '포인트, 레벨, 배지로 지속적인 참여 유도',
      color: 'text-warning-600'
    },
    {
      icon: UsersIcon,
      title: '커뮤니티',
      description: '지역 기반 협력으로 더 안전한 전력망 구축',
      color: 'text-danger-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            K-그리드 가디언즈
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            시민 참여로 만드는 안전하고 효율적인 전력망
          </p>

          {/* CTA 버튼 */}
          <div className="space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-3"
            >
              시작하기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-3"
            >
              둘러보기
            </motion.button>
          </div>
        </motion.header>

        {/* 피처 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-primary-100">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1,200+</div>
              <div className="text-primary-100">신고 완료</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100MWh</div>
              <div className="text-primary-100">월간 절약량</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}