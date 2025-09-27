'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  BoltIcon,
  TrophyIcon,
  UsersIcon,
  CpuChipIcon,
  MapPinIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function IntroPage() {
  const challenges = [
    {
      title: "전력망 안전 문제",
      description: "기울어진 전신주, 수목 접촉, 설비 파손 등 위험 요소가 늘어나고 있어요",
      icon: "⚠️"
    },
    {
      title: "에너지 효율성 저하",
      description: "개인별 맞춤형 에너지 절약 방안과 실시간 모니터링이 부족해요",
      icon: "📊"
    },
    {
      title: "시민 참여 저조",
      description: "전력망 안전과 에너지 절약에 대한 시민들의 관심과 참여가 낮아요",
      icon: "🤷‍♂️"
    }
  ]

  const solutions = [
    {
      icon: ShieldCheckIcon,
      title: "AI 기반 안전 분석",
      description: "Claude AI로 위험도를 즉시 분석하고 적절한 조치를 제안합니다",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: BoltIcon,
      title: "개인화된 절약 미션",
      description: "사용 패턴을 분석해 맞춤형 에너지 절약 미션을 제공합니다",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: TrophyIcon,
      title: "게이미피케이션 엔진",
      description: "포인트, 레벨, 배지 시스템으로 지속적인 참여를 유도합니다",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: UsersIcon,
      title: "커뮤니티 플랫폼",
      description: "지역 기반 소통과 협력으로 더 안전한 전력망을 구축합니다",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ]

  const features = [
    {
      icon: CpuChipIcon,
      title: "AI 위험도 분석",
      description: "Claude API를 활용한 실시간 이미지 분석으로 1-10점 위험도 평가"
    },
    {
      icon: MapPinIcon,
      title: "정확한 위치 서비스",
      description: "Kakao Maps API 연동으로 GPS 태깅과 정확한 주소 변환"
    },
    {
      icon: ChartBarIcon,
      title: "실시간 모니터링",
      description: "에너지 사용량 추적과 절약 효과 분석 대시보드"
    },
    {
      icon: SparklesIcon,
      title: "스마트 알림",
      description: "개인화된 미션 추천과 성취 알림 시스템"
    }
  ]

  const stats = [
    { label: "예상 월간 활성 사용자", value: "50,000명", color: "text-blue-600" },
    { label: "목표 월간 에너지 절약량", value: "100MWh", color: "text-green-600" },
    { label: "예상 월간 안전 신고", value: "500건", color: "text-red-600" },
    { label: "미션 성공률 목표", value: "65%", color: "text-purple-600" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              🏆 KDN 파워업 챌린지 2025 출품작
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              K-그리드 가디언즈
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              게이미피케이션 기반 시민참여 전력망 안전·효율 플랫폼
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              AI 분석과 게임 요소를 활용해 시민들이 즐겁게 참여할 수 있는
              혁신적인 전력망 안전 및 에너지 효율 솔루션입니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 문제 정의 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              우리가 해결하고자 하는 문제
            </h2>
            <p className="text-xl text-gray-600">
              전력망 안전과 에너지 효율성에 대한 주요 과제들
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {challenge.title}
                </h3>
                <p className="text-gray-600">
                  {challenge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 솔루션 */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              K-그리드 가디언즈의 솔루션
            </h2>
            <p className="text-xl text-gray-600">
              게이미피케이션과 AI 기술로 시민 참여를 혁신합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl ${solution.bgColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <solution.icon className={`h-12 w-12 ${solution.color} mb-6`} />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {solution.title}
                </h3>
                <p className="text-gray-700">
                  {solution.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              핵심 기술과 기능
            </h2>
            <p className="text-xl text-gray-600">
              최신 기술을 활용한 스마트한 플랫폼
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 기대 효과 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              기대되는 성과
            </h2>
            <p className="text-xl text-blue-100">
              데이터 기반의 구체적인 목표와 지표
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className={`text-3xl font-bold mb-2 ${stat.color.replace('text-', 'text-')}`}>
                  {stat.value}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              지금 바로 시작해보세요
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              K-그리드 가디언즈와 함께 안전하고 효율적인 전력망의 미래를 만들어갑시다
            </p>
            <div className="space-x-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-3"
                >
                  플랫폼 체험하기
                </motion.button>
              </Link>
              <Link href="/safety">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-3"
                >
                  안전 신고하기
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}