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
