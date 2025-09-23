'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShieldCheckIcon,
  BoltIcon,
  UsersIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolidIcon,
  ShieldCheckIcon as ShieldSolidIcon,
  BoltIcon as BoltSolidIcon,
  UsersIcon as UsersSolidIcon,
  UserCircleIcon as UserSolidIcon
} from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import PointsDisplay from '@/components/gamification/PointsDisplay'
import { useUserStore } from '@/stores/userStore'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUserStore()

  const navItems = [
    {
      name: '홈',
      href: '/',
      icon: HomeIcon,
      activeIcon: HomeSolidIcon
    },
    {
      name: '그리드 워치',
      href: '/safety',
      icon: ShieldCheckIcon,
      activeIcon: ShieldSolidIcon
    },
    {
      name: '세이버 퀘스트',
      href: '/energy',
      icon: BoltIcon,
      activeIcon: BoltSolidIcon
    },
    {
      name: '지역 현황',
      href: '/map',
      icon: () => <span className="text-lg">🗺️</span>,
      activeIcon: () => <span className="text-lg">🗺️</span>
    },
    {
      name: '커뮤니티',
      href: '/community',
      icon: UsersIcon,
      activeIcon: UsersSolidIcon
    },
    {
      name: '프로필',
      href: '/profile',
      icon: UserCircleIcon,
      activeIcon: UserSolidIcon
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                그리드 가디언즈
              </span>
            </Link>

            {/* 네비게이션 메뉴 */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const active = isActive(item.href)
                const Icon = active ? item.activeIcon : item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* 사용자 정보 */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <PointsDisplay points={user.points} size="sm" />
                  <Link href="/profile">
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </Link>
                </>
              ) : (
                <Button size="sm">로그인</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden">
        {/* 상단 헤더 */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 h-14">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">K</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                K-그리드
              </span>
            </Link>

            <div className="flex items-center space-x-2">
              {user && <PointsDisplay points={user.points} size="sm" />}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* 하단 탭 네비게이션 */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
          <div className="grid grid-cols-6 h-16">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = active ? item.activeIcon : item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center space-y-1 ${
                    active ? 'text-primary-600' : 'text-gray-600'
                  }`}
                >
                  {typeof Icon === 'function' ? (
                    <Icon />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 모바일 메뉴 오버레이 */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">메뉴</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  const Icon = active ? item.activeIcon : item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {typeof Icon === 'function' ? (
                        <Icon />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}

                {user && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.points.toLocaleString()}P
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 레이아웃 패딩 */}
      <div className="pt-16 md:pt-16 pb-16 md:pb-0" />
    </>
  )
}