'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  fadeSpeed: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: Particle[] = Array.from({ length: 60 }, () => randomParticle(width, height))

    function randomParticle(w: number, h: number): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random(),
        fadeSpeed: Math.random() * 0.003 + 0.001,
      }
    }

    let animId: number

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(139, 174, 102, ${p.opacity})`
        ctx!.fill()

        p.x += p.speedX
        p.y += p.speedY
        p.opacity -= p.fadeSpeed

        if (p.opacity <= 0 || p.y < 0) {
          Object.assign(p, randomParticle(width, height))
          p.y = height + 10
          p.opacity = 0
        }
      }
      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
