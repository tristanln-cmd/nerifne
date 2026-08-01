"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = []
    const mouse = { x: 0, y: 0 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.vx -= (dx / distance) * force * 0.02
          particle.vy -= (dy / distance) * force * 0.02
        }
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        particle.vx *= 0.99
        particle.vy *= 0.99
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96, 165, 250, ${particle.opacity})`
        ctx.fill()
      })
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    resize()
    createParticles()
    animate()
    window.addEventListener("resize", () => { resize(); createParticles() })
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}

const pages = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/positions", label: "Positions" },
  { href: "/contact", label: "Contact" },
]

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="mb-3 text-7xl font-bold text-emerald-400/20 select-none">404</p>

        <h1 className="mb-2 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
          This page doesn&apos;t exist or was moved. Here&apos;s where you can go instead:
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {pages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          â† Back to home
        </Link>
      </div>
    </main>
  )
}
