'use client'

import { useEffect, useRef } from 'react'

export function FlowFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx!.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    let animationId: number

    function drawFlowField() {
      if (!canvas || !ctx) return

      ctx.fillStyle = '#0A0A0A'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cols = 80
      const rows = 40
      const cellWidth = window.innerWidth / cols
      const cellHeight = window.innerHeight / rows

      ctx.strokeStyle = '#FF6B35'
      ctx.lineWidth = 1

      for (let y = 0; y < rows; y++) {
        ctx.beginPath()

        for (let x = 0; x < cols; x++) {
          const px = x * cellWidth
          const py = y * cellHeight

          // Flow field calculation with mountain-like peaks
          const centerX = cols / 2
          const centerY = rows / 2
          const distFromCenter = Math.sqrt(
            Math.pow((x - centerX) / cols, 2) +
              Math.pow((y - centerY) / rows, 2),
          )

          // Create mountain peaks effect
          const noise =
            Math.sin(x * 0.08 + frame * 0.008) *
            Math.cos(y * 0.08 + frame * 0.006) *
            (1 - distFromCenter * 1.5)

          const offset = noise * 60

          if (x === 0) {
            ctx.moveTo(px, py + offset)
          } else {
            ctx.lineTo(px, py + offset)
          }
        }

        // Opacity varies with row position (bottom brighter)
        ctx.globalAlpha = 0.15 + (y / rows) * 0.35
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      frame++
      animationId = requestAnimationFrame(drawFlowField)
    }

    drawFlowField()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 z-10 h-screen w-full opacity-60'
    />
  )
}
