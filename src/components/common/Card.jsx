export const Card = ({
  children,
  className = '',
  highlight = true,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-base transition-all duration-200'
  const shadowStyles = highlight
    ? 'shadow-card hover:shadow-card-hover'
    : 'shadow-none border border-neutral-border'
  const borderStyles = highlight
    ? 'border-t-4 border-t-accent-500'
    : ''

  return (
    <div
      className={`${baseStyles} ${shadowStyles} ${borderStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
