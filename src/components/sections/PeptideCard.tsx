interface PeptideCardProps {
  title: string
  description: string
  benefits: string[]
}

export function PeptideCard({ title, description, benefits }: PeptideCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-800 mb-4">{description}</p>
      <ul className="text-sm space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-gray-800">
            <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}
