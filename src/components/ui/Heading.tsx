import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = 'h2', size = 'lg', ...props }, ref) => {
    const sizes = {
      xs: 'text-sm font-medium',
      sm: 'text-base font-semibold',
      md: 'text-lg font-semibold',
      lg: 'text-xl font-bold',
      xl: 'text-2xl font-bold',
      '2xl': 'text-3xl font-bold',
      '3xl': 'text-4xl font-bold',
      '4xl': 'text-5xl font-bold lg:text-6xl',
    }

    return (
      <Component
        ref={ref}
        className={cn('text-foreground tracking-tight font-heading', sizes[size], className)}
        {...props}
      />
    )
  },
)

Heading.displayName = 'Heading'

export { Heading }
