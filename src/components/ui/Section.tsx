import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'accent' | 'primary' | 'muted'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padding = 'lg', children, ...props }, ref) => {
    const variants = {
      default: 'bg-background text-foreground',
      accent: 'bg-accent text-white',
      primary: 'bg-primary text-white',
      muted: 'bg-muted/30 text-foreground',
    }

    const paddings = {
      none: '',
      sm: 'py-8 sm:py-12',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-24',
      xl: 'py-20 sm:py-32',
    }

    return (
      <section ref={ref} className={cn(variants[variant], paddings[padding], className)} {...props}>
        {children}
      </section>
    )
  },
)

Section.displayName = 'Section'

export { Section }
