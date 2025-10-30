'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  once?: boolean
}

export function useScrollAnimation({
  threshold = 0.1,
  delay = 0,
  duration = 600,
  direction = 'up',
  once = true,
}: UseScrollAnimationOptions = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)

          if (once && elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '50px',
      },
    )

    const element = elementRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, delay, once])

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)'

    switch (direction) {
      case 'up':
        return 'translate3d(0, 50px, 0)'
      case 'down':
        return 'translate3d(0, -50px, 0)'
      case 'left':
        return 'translate3d(50px, 0, 0)'
      case 'right':
        return 'translate3d(-50px, 0, 0)'
      default:
        return 'translate3d(0, 50px, 0)'
    }
  }

  const animationStyle = {
    transform: getTransform(),
    opacity: isVisible ? 1 : 0,
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  }

  return { elementRef, animationStyle, isVisible }
}
