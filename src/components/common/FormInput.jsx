import { useState } from 'react'

export const FormInput = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  disabled = false,
  options = [],
  rows = 3,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const inputBaseStyles = 'w-full px-3 py-2 border rounded-sm font-base transition-all duration-200'
  const inputStates = isFocused
    ? 'border-accent-500 bg-accent-50'
    : error
    ? 'border-semantic-error'
    : 'border-neutral-border hover:border-neutral-text-secondary'
  const inputDisabled = disabled ? 'bg-neutral-bg text-neutral-text-secondary cursor-not-allowed' : ''

  const labelStyles = 'block text-label text-neutral-text-primary mb-2'
  const requiredStyles = required ? "after:content-['*'] after:text-semantic-error after:ml-1" : ''

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${inputBaseStyles} ${inputStates} ${inputDisabled} resize-none ${className}`}
            {...props}
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${inputBaseStyles} ${inputStates} ${inputDisabled} ${className}`}
            {...props}
          >
            <option value="">선택해주세요</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name={props.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={onChange}
                  disabled={disabled}
                  className="w-4 h-4 cursor-pointer accent-accent-500"
                />
                <span className="ml-2 text-body text-neutral-text-primary">{opt.label}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...(value || []), opt.value])
                    } else {
                      onChange((value || []).filter(v => v !== opt.value))
                    }
                  }}
                  disabled={disabled}
                  className="w-4 h-4 cursor-pointer accent-accent-500"
                />
                <span className="ml-2 text-body text-neutral-text-primary">{opt.label}</span>
              </label>
            ))}
          </div>
        )

      default:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${inputBaseStyles} ${inputStates} ${inputDisabled} ${className}`}
            {...props}
          />
        )
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className={`${labelStyles} ${requiredStyles}`}>
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-small text-semantic-error mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormInput
