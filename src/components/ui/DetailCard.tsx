import { ReactNode } from 'react'

interface DetailCardProps {
  title: string
  description: string
  benefits: string[]
  icon?: ReactNode
}

export function DetailCard({ title, description, benefits, icon }: DetailCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-sm">
      {icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="text-sm space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center">
            <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}
