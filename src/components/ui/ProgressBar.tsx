import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animate?: boolean
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    className,
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    showValue = false,
    animate = true,
    ...props
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const containerStyles = 'w-full bg-gray-200 rounded-full overflow-hidden'

    const variants = {
      default: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
    }

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    }

    const progressBar = (
      <div
        ref={ref}
        className={cn(containerStyles, sizes[size], className)}
        {...props}
      >
        <div
          className={cn('h-full transition-all duration-300', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )

    const content = (
      <div className="space-y-1">
        {progressBar}
        {showValue && (
          <div className="flex justify-between text-xs text-gray-600">
            <span>{Math.round(value)}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    )

    if (!animate) {
      return content
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar