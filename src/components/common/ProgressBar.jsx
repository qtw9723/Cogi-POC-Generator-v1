export const ProgressBar = ({
  current,
  total,
  label = true,
  className = '',
}) => {
  const percentage = (current / total) * 100

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-1 bg-neutral-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && (
        <p className="text-small text-neutral-text-secondary mt-2">
          질문 {current} / {total}
        </p>
      )}
    </div>
  )
}

export default ProgressBar
