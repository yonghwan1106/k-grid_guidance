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
  const today = selectedDate || new Date()
  const todayData = data.find(d =>
    d.date.toDateString() === today.toDateString()
  )

  // 시간대별 데이터 준비
  const hourlyData = todayData?.hourlyUsage || Array(24).fill(0)
  const maxUsage = Math.max(...hourlyData)
  const peakHours = todayData?.peakHours || []

  // 지난 7일 데이터
  const weekData = data.slice(-7).map(d => ({
    date: d.date,
    usage: d.totalDaily,
    label: d.date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
  }))

  const maxWeekUsage = Math.max(...weekData.map(d => d.usage))

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
                  {todayData ? formatEnergy(todayData.totalDaily) : '25.3kWh'}
                </div>
                <div className="text-sm text-gray-600">총 사용량</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {todayData ? formatEnergy(todayData.peakUsage) : '3.2kWh'}
                </div>
                <div className="text-sm text-gray-600">피크 사용량</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  ₩{todayData ? (todayData.cost || 0).toLocaleString() : '3,040'}
                </div>
                <div className="text-sm text-gray-600">예상 요금</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-danger-600">
                  {todayData ? `${peakHours.length}시간` : '3시간'}
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
              <div className="h-48 flex items-end space-x-1">
                {hourlyData.map((usage, hour) => {
                  const height = maxUsage > 0 ? (usage / maxUsage) * 100 : 0
                  const isPeak = peakHours.includes(hour)

                  return (
                    <motion.div
                      key={hour}
                      className="flex-1 flex flex-col items-center"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: hour * 0.02 }}
                    >
                      <div
                        className={`w-full rounded-t-sm transition-colors ${
                          isPeak
                            ? 'bg-danger-500'
                            : usage > maxUsage * 0.7
                            ? 'bg-warning-500'
                            : 'bg-primary-500'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${hour}시: ${formatEnergy(usage, 'Wh')}`}
                      />
                      {hour % 3 === 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {hour}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
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
              <div className="h-32 flex items-end space-x-2">
                {weekData.map((day, index) => {
                  const height = maxWeekUsage > 0 ? (day.usage / maxWeekUsage) * 100 : 0
                  const isToday = day.date.toDateString() === today.toDateString()

                  return (
                    <motion.div
                      key={index}
                      className="flex-1 flex flex-col items-center cursor-pointer"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => onDateSelect?.(day.date)}
                    >
                      <div
                        className={`w-full rounded-t-sm transition-colors ${
                          isToday
                            ? 'bg-primary-600'
                            : 'bg-primary-300 hover:bg-primary-400'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${day.label}: ${formatEnergy(day.usage)}`}
                      />
                      <div className={`text-xs mt-1 ${
                        isToday ? 'text-primary-600 font-medium' : 'text-gray-500'
                      }`}>
                        {day.label}
                      </div>
                    </motion.div>
                  )
                })}
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