import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'disabled'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--brand-accent)',
    color: 'var(--text-primary)',
    border: 'none',
  },
  secondary: {
    background: 'var(--bg-overlay)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
  danger: {
    background: 'var(--error-muted)',
    color: 'var(--error)',
    border: '1px solid rgba(248, 113, 113, 0.25)',
  },
  disabled: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--text-disabled)',
    border: 'none',
    cursor: 'not-allowed',
  },
}

// Dimensions + typography pulled from Figma "Button" component set 40:4095.
// Height / radius / padding-x / gap / fontSize / lineHeight / letterSpacing all
// scale per the size variant. Per the latest design-system update, button
// labels now use Sora Regular (400) — NOT SemiBold (600) — at every size, and
// XL drops the 0.1% letter-spacing of smaller sizes to 0.
//   SM → Desktop/Label/Label RG          12/16,  letterSpacing 0.1%
//   MD → Desktop/Label/Label LG (regular) 14/20,  letterSpacing 0.1%
//   LG → Desktop/Label/Label LG (regular) 14/20,  letterSpacing 0.1%
//   XL → Desktop/Body/Body LG Regular     16/24,  letterSpacing 0%
const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: '32px', padding: '0 12px', borderRadius: '8px',  gap: '6px',  fontSize: '12px', lineHeight: '16px', letterSpacing: '0.001em' },
  md: { height: '40px', padding: '0 18px', borderRadius: '10px', gap: '8px',  fontSize: '14px', lineHeight: '20px', letterSpacing: '0.001em' },
  lg: { height: '48px', padding: '0 20px', borderRadius: '10px', gap: '8px',  fontSize: '14px', lineHeight: '20px', letterSpacing: '0.001em' },
  xl: { height: '56px', padding: '0 24px', borderRadius: '12px', gap: '10px', fontSize: '16px', lineHeight: '24px', letterSpacing: '0' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const v = disabled ? 'disabled' : variant

  return (
    <button
      disabled={disabled || variant === 'disabled'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Sora', sans-serif",
        // Sora Regular (400) per the design-system update. fontSize, lineHeight,
        // letterSpacing all come from sizeStyles below.
        fontWeight: 400,
        cursor: v === 'disabled' ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        width: fullWidth ? '100%' : undefined,
        ...sizeStyles[size],
        ...variantStyles[v],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (v === 'primary') {
          e.currentTarget.style.background = 'var(--brand-accent-dark)'
        } else if (v === 'secondary') {
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.8)'
          e.currentTarget.style.color = 'var(--brand-accent)'
        }
      }}
      onMouseLeave={(e) => {
        if (v === 'primary') {
          e.currentTarget.style.background = 'var(--brand-accent)'
        } else if (v === 'secondary') {
          e.currentTarget.style.borderColor = 'var(--border-strong)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
