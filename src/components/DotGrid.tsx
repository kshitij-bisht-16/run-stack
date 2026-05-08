import { useEffect, useRef } from 'react'

/**
 * Animated 2D dot-grid with a wave effect.
 *
 * Dots do NOT move — only their brightness/opacity animates in a wave.
 * The wave phase is computed from each dot's absolute document position
 * (docX, docY) + a shared `performance.now()` time reference, so multiple
 * DotGrid instances on the page stay perfectly in sync, even when they
 * sit in different sections/frames.
 *
 * Rotation awareness: if the parent applies `transform: rotate(180deg)`
 * (as the Infrastructure section does), the component flips its local
 * y/x mapping when computing docY/docX so the visual wave still
 * propagates top-to-bottom through the page continuously.
 *
 * Matches Figma "dot-grid" layers: 4px dots, 24px spacing, #3A3A3A,
 * plus a fade rectangle overlay at the bottom.
 */
interface DotGridProps {
  /** Extra CSS style overrides for positioning */
  style?: React.CSSProperties
  /**
   * Controls the bottom fade-to-bg gradient overlay.
   *  - `true` (default): legacy behavior — fade spans the full grid (0% → 77%).
   *    Correct for small grids whose top is the fade-in edge.
   *  - `false`: no fade overlay at all — dots render uniformly across the full grid.
   *  - `{ start, end }`: fade from `start%` (fully transparent) to `end%` (full bg).
   *    Use e.g. `{ start: 85, end: 100 }` to fade only at the very bottom.
   */
  fade?: boolean | { start: number; end: number }
  /**
   * Optional top fade — mirrors `fade` but applied at the top of the grid so
   * dots ease in from above instead of starting abruptly. Same shape as `fade`.
   *  - `false` (default): no top fade.
   *  - `true`: 0% → 22% fade-in (symmetric with the default bottom fade).
   *  - `{ start, end }`: fade from `start%` (full bg) down to `end%` (transparent).
   */
  fadeTop?: boolean | { start: number; end: number }
}

export default function DotGrid({ style, fade = true, fadeTop = false }: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spacing = 24
    const radius = 1.5

    // Figma dot grid color: rgba(58, 58, 58) — animated between low/high opacity.
    const OPACITY_MIN = 0.15
    const OPACITY_MAX = 1.0

    // Detect 180° rotation from parent wrapper inline style so the wave
    // stays visually continuous with the non-rotated grid below.
    const isRotated = (wrapper.style.transform || '').includes('rotate(180deg)')

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const rect = wrapper.getBoundingClientRect()
      const absTop = rect.top + window.scrollY
      const absLeft = rect.left + window.scrollX

      const t = performance.now()

      for (let gy = spacing / 2; gy < H; gy += spacing) {
        // Rotated grid: local gy at top of canvas appears at visual bottom.
        const localVisualY = isRotated ? H - gy : gy
        const docY = absTop + localVisualY

        for (let gx = spacing / 2; gx < W; gx += spacing) {
          const localVisualX = isRotated ? W - gx : gx
          const docX = absLeft + localVisualX

          // Diagonal wave — propagates down-right across the whole document.
          // Same formula in every instance ⇒ perfect cross-section sync.
          const phase = t / 900 - docY / 140 - docX / 320
          const w = (Math.sin(phase) + 1) / 2 // 0..1
          const opacity = OPACITY_MIN + w * (OPACITY_MAX - OPACITY_MIN)

          ctx.fillStyle = `rgba(58, 58, 58, ${opacity.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(gx, gy, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '700px',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      {/* Bottom fade-out overlay — linear gradient from transparent to
          var(--bg-base) at the bottom. Gradient stops configurable via `fade`. */}
      {fade !== false && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px -29px',
            background: (() => {
              const start = fade === true ? 0 : fade.start
              const end = fade === true ? 77 : fade.end
              return `linear-gradient(to bottom, rgba(10, 10, 10, 0) ${start}%, var(--bg-base) ${end}%)`
            })(),
          }}
        />
      )}
      {/* Top fade-in overlay — mirrors the bottom fade but lets dots ease in
          from the top instead of starting abruptly. Only rendered when
          `fadeTop` is enabled so the default visual stays untouched. */}
      {fadeTop !== false && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px -29px',
            background: (() => {
              const start = fadeTop === true ? 0 : fadeTop.start
              const end = fadeTop === true ? 22 : fadeTop.end
              return `linear-gradient(to bottom, var(--bg-base) ${start}%, rgba(10, 10, 10, 0) ${end}%)`
            })(),
          }}
        />
      )}
    </div>
  )
}
