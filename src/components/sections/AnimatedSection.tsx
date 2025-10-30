'use client'

import { ElementType, ReactNode } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  as?: ElementType
}

export default function AnimatedSection({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  className = '',
  as: Component = 'div',
}: AnimatedSectionProps) {
  const { elementRef, animationStyle } = useScrollAnimation({
    delay,
    duration,
    direction,
  })

  return (
    <Component ref={elementRef} style={animationStyle} className={className}>
      {children}
    </Component>
  )
}
