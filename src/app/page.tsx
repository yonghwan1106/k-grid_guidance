'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
          <div className="mb-4">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🏆 KDN 파워업 챌린지 2025 출품작
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            K-그리드 가디언즈
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            게이미피케이션 기반 시민참여 전력망 안전·효율 플랫폼
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/safety">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-3"
              >
                시작하기
              </motion.button>
            </Link>
            <Link href="/intro">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-3"
              >
                프로젝트 소개
              </motion.button>
            </Link>
            <a href="/presentation/index.html" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden text-lg px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  📊 발표자료 보기
                </span>
              </motion.button>
            </a>
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
              whileHover={{ scale: 1.05, y: -5 }}
              className="card-hover group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className={`p-3 rounded-xl ${feature.color.includes('primary') ? 'bg-blue-100' :
                  feature.color.includes('success') ? 'bg-green-100' :
                  feature.color.includes('warning') ? 'bg-yellow-100' : 'bg-red-100'}
                  w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">실시간 성과 지표</h2>
              <p className="text-blue-100">시민 여러분과 함께 만들어가는 변화</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold mb-2 text-yellow-300">5,000+</div>
                <div className="text-blue-100 font-medium">활성 사용자</div>
                <div className="text-xs text-blue-200 mt-1">📱 매일 증가 중</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold mb-2 text-green-300">1,200+</div>
                <div className="text-blue-100 font-medium">신고 완료</div>
                <div className="text-xs text-blue-200 mt-1">🛡️ 안전 향상</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold mb-2 text-blue-300">100MWh</div>
                <div className="text-blue-100 font-medium">월간 절약량</div>
                <div className="text-xs text-blue-200 mt-1">⚡ 에너지 효율</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}