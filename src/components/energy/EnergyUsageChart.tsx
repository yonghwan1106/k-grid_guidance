'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EnergyUsage } from '@/types'
import { formatEnergy } from '@/lib/utils'

interface EnergyUsageChartProps {
  data: EnergyUsage[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export default function EnergyUsageChart({
  data,
  selectedDate,
  onDateSelect
}: EnergyUsageChartProps) {
  // 데이터가 없으면 기본 데이터 사용
  const hasData = data && data.length > 0

  const today = selectedDate || new Date()

  // 날짜 비교를 더 안전하게 처리
  const todayData = hasData ? data.find(d => {
    const dataDate = new Date(d.date)
    return dataDate.toDateString() === today.toDateString()
  }) : null

  // 데이터가 없으면 가장 최근 데이터 사용
  const displayData = todayData || (hasData ? data[data.length - 1] : null)

  // 시간대별 데이터 준비 - 실제 데이터 또는 기본 데모 데이터 (고정 패턴)
  const defaultHourlyPattern = [
    0.4, 0.3, 0.3, 0.3, 0.4, 0.5, // 0-5시 (심야)
    1.2, 2.5, 2.8, // 6-8시 (아침 피크)
    1.9, 1.7, 1.8, // 9-11시 (오전)
    2.1, 2.3, // 12-13시 (점심)
    2.8, 3.2, 3.5, 3.4, // 14-17시 (오후 피크)
    3.1, 2.9, 2.8, // 18-20시 (저녁)
    2.3, 1.9, 1.2 // 21-23시 (밤)
  ]
  const hourlyData = displayData?.hourlyUsage || defaultHourlyPattern

  const maxUsage = Math.max(...hourlyData, 0.1)
  const peakHours = displayData?.peakHours || hourlyData
    .map((usage, hour) => Math.abs(usage - maxUsage) < 0.2 ? hour : -1)
    .filter(h => h !== -1)

  // 지난 7일 데이터 - 안전하게 처리 (고정 패턴)
  const defaultWeeklyUsage = [47.36, 50.12, 48.89, 51.34, 49.76, 45.23, 43.87] // 최근 7일 kWh
  const weekData = hasData && data.length > 0
    ? data.slice(-7).map(d => ({
        date: new Date(d.date),
        usage: d.totalDaily,
        label: new Date(d.date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
      }))
    : Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date,
          usage: defaultWeeklyUsage[i],
          label: date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
        }
      })

  const maxWeekUsage = Math.max(...weekData.map(d => d.usage), 0.1)

  return (
    <div className="space-y-6">
      {/* 일간 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>오늘의 에너지 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {displayData ? formatEnergy(displayData.totalDaily) : formatEnergy(hourlyData.reduce((sum, usage) => sum + usage, 0))}
                </div>
                <div className="text-sm text-gray-600">총 사용량</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {displayData ? formatEnergy(displayData.peakUsage) : formatEnergy(maxUsage)}
                </div>
                <div className="text-sm text-gray-600">피크 사용량</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  ₩{displayData ? (displayData.cost || 0).toLocaleString() : Math.round(hourlyData.reduce((sum, usage) => sum + usage, 0) * 120).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">예상 요금</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-danger-600">
                  {peakHours.length}시간
                </div>
                <div className="text-sm text-gray-600">피크 시간대</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 시간대별 차트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>시간대별 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 차트 */}
              <div className="relative">
                <div className="h-48 flex items-end justify-between gap-0.5">
                  {hourlyData.map((usage, hour) => {
                    const maxHeight = 192 // h-48 = 192px
                    const barHeight = maxUsage > 0 ? (usage / maxUsage) * maxHeight : 0
                    const isPeak = peakHours.includes(hour)

                    return (
                      <div
                        key={hour}
                        className="flex-1 flex flex-col items-center"
                      >
                        <motion.div
                          className={`w-full rounded-t min-h-[2px] ${
                            isPeak
                              ? 'bg-danger-500'
                              : usage > maxUsage * 0.7
                              ? 'bg-warning-500'
                              : 'bg-primary-500'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: barHeight }}
                          transition={{ delay: hour * 0.02, duration: 0.5, ease: 'easeOut' }}
                          title={`${hour}시: ${formatEnergy(usage)}`}
                        />
                        {hour % 3 === 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {hour}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 범례 */}
              <div className="flex justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-primary-500 rounded-sm" />
                  <span>일반</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-warning-500 rounded-sm" />
                  <span>높음</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-danger-500 rounded-sm" />
                  <span>피크</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 주간 트렌드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>주간 사용량 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 차트 */}
              <div className="relative">
                <div className="h-32 flex items-end justify-between gap-2">
                  {weekData.map((day, index) => {
                    const maxHeight = 128 // h-32 = 128px
                    const barHeight = maxWeekUsage > 0 ? (day.usage / maxWeekUsage) * maxHeight : 0
                    const isToday = day.date.toDateString() === today.toDateString()

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center cursor-pointer"
                        onClick={() => onDateSelect?.(day.date)}
                      >
                        <motion.div
                          className={`w-full rounded-t min-h-[4px] ${
                            isToday
                              ? 'bg-primary-600'
                              : 'bg-primary-300 hover:bg-primary-400'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: barHeight }}
                          transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                          title={`${day.label}: ${formatEnergy(day.usage)}`}
                        />
                        <div className={`text-xs mt-1 ${
                          isToday ? 'text-primary-600 font-medium' : 'text-gray-500'
                        }`}>
                          {day.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {weekData.length > 0 ? formatEnergy(weekData.reduce((sum, d) => sum + d.usage, 0)) : '177.1kWh'}
                  </div>
                  <div className="text-sm text-gray-600">주간 총합</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {weekData.length > 0 ? formatEnergy(weekData.reduce((sum, d) => sum + d.usage, 0) / weekData.length) : '25.3kWh'}
                  </div>
                  <div className="text-sm text-gray-600">일평균</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-success-600">
                    {weekData.length > 1 ? (
                      <>
                        {weekData[weekData.length - 1].usage < weekData[weekData.length - 2].usage ? '↓' : '↑'}
                        {Math.abs(
                          ((weekData[weekData.length - 1].usage - weekData[weekData.length - 2].usage) / weekData[weekData.length - 2].usage * 100)
                        ).toFixed(1)}%
                      </>
                    ) : '↓ 2.4%'}
                  </div>
                  <div className="text-sm text-gray-600">전일 대비</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}