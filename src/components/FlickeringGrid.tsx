import { useCallback, useEffect, useMemo, useRef } from 'react'

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  /**
   * When set, squares within `hoverRadius` pixels of the cursor blend toward
   * this color with a smooth falloff. Used in the hero logo to paint brand
   * accent (#6366F1) under the cursor while the rest of the logo stays its
   * base neutral. Pass `null`/omit to disable hover entirely.
   */
  hoverColor?: string
  /** Falloff radius in CSS pixels. Default 90. */
  hoverRadius?: number
  /**
   * 0..1 — strength of the brand-color blend at the cursor center. 1 = fully
   * replace base color, 0 = no effect. Default 1.
   */
  hoverIntensity?: number
  maxOpacity?: number
  style?: React.CSSProperties
}

// Resolves any CSS color string ('rgb()', 'hex', 'var(--x)' that's been
// resolved at call-site) into {r,g,b} via a 1×1 canvas swatch.
function parseRgb(color: string): { r: number; g: number; b: number } {
  if (typeof window === 'undefined') return { r: 0, g: 0, b: 0 }
  const tmp = document.createElement('canvas')
  tmp.width = tmp.height = 1
  const ctx = tmp.getContext('2d')
  if (!ctx) return { r: 99, g: 102, b: 241 }
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
  return { r, g, b }
}

export default function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(99, 102, 241)',
  hoverColor,
  hoverRadius = 90,
  hoverIntensity = 1,
  maxOpacity = 0.3,
  style,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Mouse position in CSS pixels relative to the container's top-left.
  // `active=false` when the cursor is outside the container — the draw
  // loop reads this via ref so we don't trigger React re-renders on
  // every mousemove.
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  const baseRgb = useMemo(() => parseRgb(color), [color])
  const hoverRgb = useMemo(() => (hoverColor ? parseRgb(hoverColor) : null), [hoverColor])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.floor(width / (squareSize + gridGap))
      const rows = Math.floor(height / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity],
  )

  // Mouse tracking — pointer events on the container, canvas stays
  // pointer-events:none so it never blocks clicks underneath.
  useEffect(() => {
    const container = containerRef.current
    if (!container || !hoverRgb) return
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }
    const onLeave = () => {
      mouseRef.current.active = false
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [hoverRgb])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let gridParams: ReturnType<typeof setupCanvas>

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) gridParams = setupCanvas(canvas, w, h)
    }

    resize()

    let lastTime = 0
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate)
      if (!gridParams) return

      const delta = (time - lastTime) / 1000
      lastTime = time

      // Flicker
      for (let i = 0; i < gridParams.squares.length; i++) {
        if (Math.random() < flickerChance * delta) {
          gridParams.squares[i] = Math.random() * maxOpacity
        }
      }

      // Cache hover state for this frame
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const hovering = mouseRef.current.active && hoverRgb !== null
      const r2 = hoverRadius * hoverRadius
      const cellStride = squareSize + gridGap
      const dpr = gridParams.dpr
      const drawSize = squareSize * dpr

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < gridParams.cols; i++) {
        const sx = i * cellStride
        const cx = sx + squareSize / 2
        for (let j = 0; j < gridParams.rows; j++) {
          const op = gridParams.squares[i * gridParams.rows + j]
          let r = baseRgb.r
          let g = baseRgb.g
          let b = baseRgb.b
          let alpha = op

          if (hovering && hoverRgb) {
            const sy = j * cellStride
            const cy = sy + squareSize / 2
            const dx = cx - mx
            const dy = cy - my
            const d2 = dx * dx + dy * dy
            if (d2 < r2) {
              // Smoothstep falloff: 1 at center → 0 at radius edge.
              // tLin is the linear normalised distance (0 = center).
              const tLin = 1 - Math.sqrt(d2) / hoverRadius
              const t = tLin * tLin * (3 - 2 * tLin) * hoverIntensity
              r = baseRgb.r + (hoverRgb.r - baseRgb.r) * t
              g = baseRgb.g + (hoverRgb.g - baseRgb.g) * t
              b = baseRgb.b + (hoverRgb.b - baseRgb.b) * t
              // Lift opacity slightly inside the hover area so the brand
              // color reads clearly even on dim flickering cells.
              alpha = op + (maxOpacity - op) * t
            }
          }

          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`
          ctx.fillRect(
            i * cellStride * dpr,
            j * cellStride * dpr,
            drawSize,
            drawSize,
          )
        }
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      ro.disconnect()
    }
  }, [setupCanvas, baseRgb, hoverRgb, hoverRadius, hoverIntensity, squareSize, gridGap, flickerChance, maxOpacity])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', ...style }}>
      <canvas ref={canvasRef} style={{ display: 'block', pointerEvents: 'none' }} />
    </div>
  )
}
