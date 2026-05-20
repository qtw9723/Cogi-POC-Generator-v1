# Cogi POC Generator UI/UX 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 구현 MindwareWorks 브랜드 아이덴티티를 반영한 기술적이고 고급스러운 UI/UX로 개선하여 사용자와 관리자 모두가 효율적으로 사용할 수 있도록 한다.

**Architecture:** Phase 1에서는 핵심 UI 기초(색상, 타이포그래피, 공통 컴포넌트, 헤더, 설문/결과 UI)를 구현한다. 기존 컴포넌트들을 새로운 디자인 시스템과 통합하며, Phase 2(관리자 UI)와 Phase 3(고도화)는 이후에 진행한다.

**Tech Stack:** React 19, React Router v6, Tailwind CSS, Vite

---

## 파일 구조

### 새로 생성할 파일

```
src/
├── index.css (수정 - 글로벌 스타일 확장)
├── utils/
│   └── colors.js (새로 생성 - 색상 상수)
├── components/
│   ├── common/
│   │   ├── Button.jsx (새로 생성)
│   │   ├── Card.jsx (새로 생성)
│   │   ├── ProgressBar.jsx (새로 생성)
│   │   ├── FormInput.jsx (새로 생성)
│   │   └── Modal.jsx (새로 생성)
│   ├── layout/
│   │   └── Header.jsx (새로 생성)
│   ├── questionnaire/
│   │   ├── QuestionCard.jsx (새로 생성)
│   │   └── QuestionnaireForm.jsx (수정)
│   └── results/
│       ├── ResultCard.jsx (새로 생성)
│       ├── ResultsList.jsx (수정)
│       └── ResultDetailModal.jsx (새로 생성)
└── App.jsx (수정)
```

### 수정할 파일

- `tailwind.config.js` - 색상, 폰트 커스터마이징
- `src/App.jsx` - Header 통합, 레이아웃 구조
- `src/components/QuestionnaireForm.jsx` - 새로운 컴포넌트 사용
- `src/components/ResultList.jsx` - 새로운 컴포넌트 사용

---

## Task 1: 색상 시스템 및 타이포그래피 설정

**Files:**
- Create: `src/utils/colors.js`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: 색상 상수 파일 생성**

Create `src/utils/colors.js`:

```javascript
// MindwareWorks 브랜드 색상 시스템
export const colors = {
  // Primary - 짙은 남색 (신뢰감, 전문성)
  primary: {
    50: '#F0F4FB',
    100: '#D9E5F4',
    500: '#001F3F',
    600: '#001A35',
    700: '#00142A',
  },

  // Accent - 밝은 파란색 (강조, 상호작용)
  accent: {
    50: '#E6F2FF',
    100: '#B3D9FF',
    500: '#0074D9',
    600: '#0056B3',
    700: '#003D82',
  },

  // Neutral 시스템
  neutral: {
    white: '#FFFFFF',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    border: '#E9ECEF',
    textPrimary: '#1A1A1A',
    textSecondary: '#6C757D',
  },

  // Semantic 색상
  semantic: {
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
  },
}

export default colors
```

- [ ] **Step 2: Tailwind 설정 커스터마이징**

Modify `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#F0F4FB',
          100: '#D9E5F4',
          500: '#001F3F',
          600: '#001A35',
          700: '#00142A',
        },
        // Accent colors
        accent: {
          50: '#E6F2FF',
          100: '#B3D9FF',
          500: '#0074D9',
          600: '#0056B3',
          700: '#003D82',
        },
        // Neutral
        neutral: {
          bg: '#F8F9FA',
          border: '#E9ECEF',
          text: {
            primary: '#1A1A1A',
            secondary: '#6C757D',
          },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Pretendard', 'Noto Sans KR', 'Segoe UI', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'modal': '0 10px 40px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'sm': '6px',
        'base': '8px',
        'lg': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'pulse-soft': 'pulseSoft 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
}
```

- [ ] **Step 3: 글로벌 스타일 확장**

Modify `src/index.css`:

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-family: system-ui, -apple-system, 'Pretendard', 'Noto Sans KR', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #f8f9fa;
  color: #1a1a1a;
}

input, textarea, select {
  font-family: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
}

html {
  overflow-y: scroll;
}

/* Transitions */
button, input, textarea, select, a {
  transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 2px solid #0074D9;
  outline-offset: 2px;
}

/* Scrollbar styling (webkit) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f8f9fa;
}

::-webkit-scrollbar-thumb {
  background: #d0d4d9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b0b4b9;
}
```

- [ ] **Step 4: 커밋**

```bash
git add src/utils/colors.js tailwind.config.js src/index.css
git commit -m "feat: add color system and tailwind configuration

- Create color constants aligned with MindwareWorks branding
- Extend Tailwind config with custom colors, fonts, shadows, animations
- Update global styles with improved typography and accessibility

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Button 공통 컴포넌트

**Files:**
- Create: `src/components/common/Button.jsx`

- [ ] **Step 1: Button 컴포넌트 구현**

Create `src/components/common/Button.jsx`:

```javascript
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
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/common/Button.jsx
git commit -m "feat: create Button component with variants

- Implement primary, secondary, danger variants
- Support sizes: sm, md, lg, full
- Include hover and active states with smooth transitions
- Add focus-visible for accessibility

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Card 공통 컴포넌트

**Files:**
- Create: `src/components/common/Card.jsx`

- [ ] **Step 1: Card 컴포넌트 구현**

Create `src/components/common/Card.jsx`:

```javascript
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
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/common/Card.jsx
git commit -m "feat: create Card component

- Implement card with top blue border accent
- Support shadow and borderless variants
- Add smooth hover transition

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 4: ProgressBar 공통 컴포넌트

**Files:**
- Create: `src/components/common/ProgressBar.jsx`

- [ ] **Step 1: ProgressBar 컴포넌트 구현**

Create `src/components/common/ProgressBar.jsx`:

```javascript
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
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/common/ProgressBar.jsx
git commit -m "feat: create ProgressBar component

- Implement gradient progress bar (navy to blue)
- Display current/total with optional label
- Smooth transition animation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 5: FormInput 공통 컴포넌트

**Files:**
- Create: `src/components/common/FormInput.jsx`

- [ ] **Step 1: FormInput 컴포넌트 구현**

Create `src/components/common/FormInput.jsx`:

```javascript
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
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/common/FormInput.jsx
git commit -m "feat: create FormInput component supporting multiple types

- Support text, textarea, select, radio, checkbox types
- Include label, error, and disabled states
- Implement focus styling with blue accent
- Handle checkbox arrays for multiple selections

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Modal 공통 컴포넌트

**Files:**
- Create: `src/components/common/Modal.jsx`

- [ ] **Step 1: Modal 컴포넌트 구현**

Create `src/components/common/Modal.jsx`:

```javascript
import { useEffect } from 'react'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative bg-white rounded-lg shadow-modal border-t-4 border-t-accent-500 ${sizeStyles[size]} w-[90vw] max-h-[90vh] overflow-y-auto animate-slide-up ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-text-secondary hover:text-neutral-text-primary transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        {title && (
          <div className="border-b border-neutral-border p-6">
            <h2 className="text-h2 text-primary-500">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/common/Modal.jsx
git commit -m "feat: create Modal component

- Implement modal with overlay and fade-in animation
- Support multiple sizes (sm, md, lg, xl)
- Include close button and scroll lock
- Add blue top border accent

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Header 컴포넌트

**Files:**
- Create: `src/components/layout/Header.jsx`

- [ ] **Step 1: Header 컴포넌트 구현**

Create `src/components/layout/Header.jsx`:

```javascript
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const Header = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const navItems = [
    { label: '생성기', path: '/' },
    { label: '결과', path: '/results' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MW</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">MindwareWorks</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium hover:text-accent-100 transition-colors"
            >
              {item.label}
            </button>
          ))}

          {isAuthenticated && (
            <button
              onClick={() => navigate('/admin/questions')}
              className="text-sm font-medium hover:text-accent-100 transition-colors border-l border-white/20 pl-6"
            >
              관리
            </button>
          )}
        </nav>

        {/* User Menu */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:text-accent-100 transition-colors"
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/layout/Header.jsx
git commit -m "feat: create Header component with navigation

- Implement sticky header with MindwareWorks branding
- Add responsive navigation (생성기, 결과, 관리)
- Include logout button for authenticated users
- Add smooth hover transitions

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 8: QuestionCard 컴포넌트

**Files:**
- Create: `src/components/questionnaire/QuestionCard.jsx`

- [ ] **Step 1: QuestionCard 컴포넌트 구현**

Create `src/components/questionnaire/QuestionCard.jsx`:

```javascript
import { Card } from '../common/Card'
import { FormInput } from '../common/FormInput'

export const QuestionCard = ({
  question,
  value,
  onChange,
  error = null,
}) => {
  if (!question) return null

  const getOptions = () => {
    if (typeof question.options === 'string') {
      return JSON.parse(question.options)
    }
    return question.options || []
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h3 className="text-h3 text-primary-500 mb-2">{question.text}</h3>
        {question.description && (
          <p className="text-small text-neutral-text-secondary">{question.description}</p>
        )}
      </div>

      <FormInput
        type={question.type}
        value={value}
        onChange={(e) => {
          if (question.type === 'checkbox') {
            onChange(e)
          } else if (question.type === 'radio') {
            onChange(e.target.value)
          } else {
            onChange(e.target.value)
          }
        }}
        placeholder={`${question.text}를 입력해주세요`}
        options={getOptions()}
        rows={question.type === 'textarea' ? 4 : undefined}
        required={question.required}
        error={error}
      />
    </Card>
  )
}

export default QuestionCard
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/questionnaire/QuestionCard.jsx
git commit -m "feat: create QuestionCard component

- Wrapper for displaying questions with FormInput
- Support all input types (text, textarea, select, radio, checkbox)
- Include question title and optional description
- Handle error display

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 9: QuestionnaireForm 리팩토링

**Files:**
- Modify: `src/components/questionnaire/QuestionnaireForm.jsx`

- [ ] **Step 1: 현재 파일 읽기**

Read and understand current structure

- [ ] **Step 2: QuestionnaireForm 리팩토링**

Modify `src/components/questionnaire/QuestionnaireForm.jsx`:

```javascript
import { useState, useEffect } from 'react'
import { useQuestions } from '../../context/QuestionsContext'
import { useResults } from '../../hooks/useResults'
import { useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { ProgressBar } from '../common/ProgressBar'
import { QuestionCard } from './QuestionCard'
import { Modal } from '../common/Modal'

export const QuestionnaireForm = () => {
  const navigate = useNavigate()
  const { questions } = useQuestions()
  const { createResult } = useResults()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [resultId, setResultId] = useState(null)

  const currentQuestion = questions[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
    // Clear error when user starts typing
    if (errors[currentQuestion.id]) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: null,
      }))
    }
  }

  const validateCurrentQuestion = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: '필수 항목입니다',
      }))
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (isLast) {
        handleSubmit()
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await createResult(answers)
      setResultId(result.id)
      setShowCompletionModal(true)
    } catch (error) {
      console.error('설문 작성 오류:', error)
      setErrors({ submit: '설문 작성 중 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewResults = () => {
    setShowCompletionModal(false)
    navigate(`/results/${resultId}`)
  }

  const handleNewQuestionnaire = () => {
    setCurrentIndex(0)
    setAnswers({})
    setErrors({})
    setShowCompletionModal(false)
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-base p-8 text-center shadow-card">
          <p className="text-neutral-text-secondary">사용 가능한 설문이 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.id] || ''}
            onChange={handleAnswerChange}
            error={errors[currentQuestion.id]}
          />
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="mb-4 p-4 bg-semantic-error/10 border border-semantic-error rounded-base text-semantic-error text-small">
          {errors.submit}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrevious}
          disabled={isFirst}
        >
          이전
        </Button>
        <Button
          variant="primary"
          size="full"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? '작성 중...' : isLast ? '완료' : '다음'}
        </Button>
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={handleNewQuestionnaire}
        title="설문 작성 완료"
        size="md"
      >
        <div className="text-center">
          <p className="text-h3 text-primary-500 mb-4">축하합니다!</p>
          <p className="text-body text-neutral-text-secondary mb-8">
            설문 작성이 완료되었습니다. 작성하신 답변은 결과에 저장되었습니다.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="full"
              onClick={handleNewQuestionnaire}
            >
              새로운 설문 작성
            </Button>
            <Button
              variant="primary"
              size="full"
              onClick={handleViewResults}
            >
              결과 보기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default QuestionnaireForm
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/questionnaire/QuestionnaireForm.jsx
git commit -m "refactor: upgrade QuestionnaireForm with new design system

- Integrate ProgressBar and QuestionCard components
- Implement completion modal with new design
- Improve error handling and validation
- Add loading states for better UX
- Update button styling with new component library

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 10: ResultCard 및 ResultsList 컴포넌트

**Files:**
- Create: `src/components/results/ResultCard.jsx`
- Create: `src/components/results/ResultDetailModal.jsx`
- Modify: `src/components/results/ResultsList.jsx`

- [ ] **Step 1: ResultCard 컴포넌트 구현**

Create `src/components/results/ResultCard.jsx`:

```javascript
import { Card } from '../common/Card'
import { Button } from '../common/Button'

export const ResultCard = ({
  result,
  onView,
  onDelete,
  isLoading = false,
}) => {
  const formattedDate = new Date(result.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className="p-6" highlight={true}>
      <h3 className="text-h3 text-primary-500 mb-2">결과 #{result.id.slice(0, 8)}</h3>
      <p className="text-small text-neutral-text-secondary mb-6">{formattedDate}</p>

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => onView(result)}
          disabled={isLoading}
        >
          보기
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => onDelete(result.id)}
          disabled={isLoading}
        >
          삭제
        </Button>
      </div>
    </Card>
  )
}

export default ResultCard
```

- [ ] **Step 2: ResultDetailModal 구현**

Create `src/components/results/ResultDetailModal.jsx`:

```javascript
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

export const ResultDetailModal = ({
  isOpen,
  onClose,
  result,
}) => {
  const handleCopy = () => {
    const jsonString = JSON.stringify(result.data, null, 2)
    navigator.clipboard.writeText(jsonString)
    alert('JSON이 복사되었습니다')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="결과 상세보기"
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <p className="text-label text-neutral-text-primary mb-2">생성된 데이터</p>
          <pre className="bg-neutral-bg p-4 rounded-base overflow-x-auto text-small text-neutral-text-primary max-h-96 overflow-y-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>

        <Button
          variant="primary"
          size="full"
          onClick={handleCopy}
        >
          JSON 복사
        </Button>
      </div>
    </Modal>
  )
}

export default ResultDetailModal
```

- [ ] **Step 3: ResultsList 리팩토링**

Modify `src/components/results/ResultsList.jsx`:

```javascript
import { useEffect, useState } from 'react'
import { useResults } from '../../hooks/useResults'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { ResultCard } from './ResultCard'
import { ResultDetailModal } from './ResultDetailModal'
import { FormInput } from '../common/FormInput'

export const ResultsList = () => {
  const { results, deleteResult } = useResults()
  const [filteredResults, setFilteredResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let filtered = [...results]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((result) =>
        result.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredResults(filtered)
  }, [results, searchTerm, sortOrder])

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setIsDeleting(true)
      try {
        await deleteResult(id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleViewResult = (result) => {
    setSelectedResult(result)
    setIsModalOpen(true)
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-neutral-text-secondary mb-6">아직 생성된 결과가 없습니다</p>
          <Button variant="primary" size="md">
            설문 작성하기
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-h2 text-primary-500 mb-8">생성된 결과</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <FormInput
          type="text"
          label="검색"
          placeholder="결과 ID로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormInput
          type="select"
          label="정렬"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          options={[
            { value: 'newest', label: '최신순' },
            { value: 'oldest', label: '오래된순' },
          ]}
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            onView={handleViewResult}
            onDelete={handleDelete}
            isLoading={isDeleting}
          />
        ))}
      </div>

      {filteredResults.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-neutral-text-secondary">검색 결과가 없습니다</p>
        </div>
      )}

      {/* Detail Modal */}
      <ResultDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedResult(null)
        }}
        result={selectedResult}
      />
    </div>
  )
}

export default ResultsList
```

- [ ] **Step 4: 커밋**

```bash
git add src/components/results/ResultCard.jsx src/components/results/ResultDetailModal.jsx src/components/results/ResultsList.jsx
git commit -m "refactor: upgrade results UI with new design system

- Create ResultCard component with action buttons
- Create ResultDetailModal for viewing JSON details
- Upgrade ResultsList with search and sorting
- Implement grid layout for results display
- Add confirmation dialogs for destructive actions

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 11: App.jsx 통합

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: App.jsx에 Header 통합**

Modify `src/App.jsx`:

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { QuestionsProvider } from './context/QuestionsContext'
import { ReferencesProvider } from './context/ReferencesContext'
import { ResultsProvider } from './context/ResultsContext'
import { Header } from './components/layout/Header'
import QuestionnaireForm from './components/questionnaire/QuestionnaireForm'
import ResultsList from './components/results/ResultsList'
import ResultDetail from './components/ResultDetail'
import AdminLogin from './components/AdminLogin'
import QuestionManager from './components/QuestionManager'
import ReferenceManager from './components/ReferenceManager'

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? element : <Navigate to="/admin/login" replace />
}

const AppContent = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-bg">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<QuestionnaireForm />} />
          <Route path="/results" element={<ResultsList />} />
          <Route path="/results/:id" element={<ResultDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/questions" /> : <AdminLogin />} />
          <Route
            path="/admin/questions"
            element={<ProtectedRoute element={<QuestionManager />} />}
          />
          <Route
            path="/admin/references"
            element={<ProtectedRoute element={<ReferenceManager />} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <QuestionsProvider>
          <ReferencesProvider>
            <ResultsProvider>
              <AppContent />
            </ResultsProvider>
          </ReferencesProvider>
        </QuestionsProvider>
      </AuthProvider>
    </Router>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/App.jsx
git commit -m "refactor: integrate Header component and improve layout

- Add Header component to main layout
- Improve main content area styling
- Organize routes more clearly with comments
- Add consistent background color from new design system

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 12: AdminLogin 스타일 업그레이드

**Files:**
- Modify: `src/components/AdminLogin.jsx`

- [ ] **Step 1: AdminLogin 업그레이드**

Modify `src/components/AdminLogin.jsx`:

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card } from './common/Card'
import { Button } from './common/Button'
import { FormInput } from './common/FormInput'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [token, setToken] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(token)
      navigate('/admin/questions')
    } catch (err) {
      setError('로그인 토큰이 유효하지 않습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h1 className="text-h2 text-primary-500 mb-2 text-center">관리자 로그인</h1>
          <p className="text-small text-neutral-text-secondary text-center mb-8">
            관리자 토큰을 입력하여 관리 페이지에 접근하세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              type="password"
              label="관리자 토큰"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="토큰을 입력해주세요"
              required
              error={error}
            />

            {error && (
              <div className="p-4 bg-semantic-error/10 border border-semantic-error rounded-base text-semantic-error text-small">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="full"
              disabled={isLoading || !token}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="text-small text-neutral-text-secondary text-center mt-6">
            토큰이 없으신가요?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              설문 작성하기
            </button>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/AdminLogin.jsx
git commit -m "refactor: upgrade AdminLogin styling with new design system

- Integrate Button, Card, and FormInput components
- Improve layout and spacing
- Add error messaging with semantic colors
- Enhance visual hierarchy and accessibility

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## 최종 단계

- [ ] **Step 1: 전체 앱 테스트**

Run development server:

```bash
npm run dev
```

Verify:
- Header displays with MindwareWorks branding
- Navigation works (생성기, 결과, 관리)
- Questionnaire form shows with progress bar
- Buttons and inputs have new styling
- Colors match design specification
- Responsive layout works on mobile/tablet/desktop

- [ ] **Step 2: 최종 커밋**

```bash
git add -A
git commit -m "feat: complete Phase 1 UI/UX redesign

Implemented MindwareWorks branded design system with:
- Color system (navy blue primary, light blue accent)
- Common component library (Button, Card, FormInput, ProgressBar, Modal)
- Header navigation component
- Upgraded questionnaire form with progress tracking
- Improved results display with grid layout
- Consistent styling across all pages
- Enhanced accessibility with focus states
- Responsive design foundation

Phase 1 (core) completed. Ready for Phase 2 (admin) and Phase 3 (enhancements).

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 1 완료 후 다음 단계

- **Phase 2 (관리자 UI)**: AdminSidebar, QuestionTable, ReferenceTable 등의 관리자 인터페이스 개선
- **Phase 3 (고도화)**: 마이크로인터랙션, 모바일 반응형 최적화, 로딩 상태 UI, 접근성 개선

