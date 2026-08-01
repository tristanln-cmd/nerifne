"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

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

export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6">
          <Image
            src="/images/nerfine-pfp.png"
            alt="Mathis"
            width={80}
            height={80}
            className="rounded-full border-4 border-primary/20 mx-auto"
            loading="eager"
          />
        </div>

        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-400">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Maintenance
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Back shortly
        </h1>

        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The site is temporarily down for maintenance. Check back in a little while, or reach out on Discord in the meantime.
        </p>

        <a
          href="https://discord.com/users/286201707346526229"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6980.7719-1.3628 1.0824-1.9932a.076.076 0 00-.0842-.0286c-.5927-.2274-1.1579-.5063-1.7011-.8348a.077.077 0 01-.0076-.1277c.1142-.0852.2285-.1741.3371-.2643a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1087.0910.2230.1800.3371.2643a.077.077 0 01-.0066.1276 11.2986 11.2986 0 01-1.7022.8358.0766.0766 0 00-.0842.0276c.3128.6304.6219 1.2952 1.0824 1.9932a.076.076 0 00.0842.0286c1.9615-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189z" />
          </svg>
          @nerfine (Mathis) on Discord
        </a>

        <p className="mt-12 text-xs text-muted-foreground/40">
          nerfine.xyz Â· Mathis Â· MDL Digital Support
        </p>
      </div>
    </main>
  )
}
