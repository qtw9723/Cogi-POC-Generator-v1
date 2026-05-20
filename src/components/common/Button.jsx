export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-base transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2'

  const variantStyles = {
    primary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 disabled:bg-neutral-border disabled:cursor-not-allowed',
    secondary: 'bg-white text-primary-500 border border-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:bg-neutral-bg disabled:border-neutral-border disabled:cursor-not-allowed',
    danger: 'bg-semantic-error text-white hover:bg-red-700 active:bg-red-800 disabled:bg-neutral-border disabled:cursor-not-allowed',
  }

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
    full: 'w-full px-4 py-2.5 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
