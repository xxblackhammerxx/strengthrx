import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'primary' | 'muted'
  padding?: 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white text-foreground',
      accent: 'bg-accent text-foreground',
      primary: 'bg-primary text-white',
      muted: 'bg-muted/30 text-foreground',
    }

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl shadow-sm border border-border',
          variants[variant],
          paddings[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'

export interface CardIconProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardIcon = forwardRef<HTMLDivElement, CardIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

CardIcon.displayName = 'CardIcon'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn('text-xl font-semibold mb-3', className)} {...props}>
        {children}
      </h3>
    )
  },
)

CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('text-muted-foreground mb-4', className)} {...props}>
        {children}
      </p>
    )
  },
)

CardDescription.displayName = 'CardDescription'

export interface CardListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
}

const CardList = forwardRef<HTMLUListElement, CardListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn('text-sm space-y-1', className)} {...props}>
        {children}
      </ul>
    )
  },
)

CardList.displayName = 'CardList'

export { Card, CardIcon, CardTitle, CardDescription, CardList }
