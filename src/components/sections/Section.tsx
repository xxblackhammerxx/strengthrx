export function Section({
  children,
  gradient = false,
}: {
  children: React.ReactNode
  gradient: boolean
}) {
  const variantStyles = {
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-white',
  }

  
  return <section className={`${variantStyles}`}>{children}</section>
}
