import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
