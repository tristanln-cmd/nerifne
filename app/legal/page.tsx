"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Footer } from "@/components/Footer"
import { ArrowLeft, Building2, MapPin, Calendar, Hash, Tag, Briefcase } from "lucide-react"

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

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
        <Icon className="h-3.5 w-3.5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground/70 mb-0.5">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function Legal() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-20 pb-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Legal Information</h1>
          <p className="text-muted-foreground">
            Company registration details and legal notice for MDL Digital Support.
          </p>
        </section>

        
        <section className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Company Identity</h2>
          </div>
          <div className="rounded-lg border-2 border-emerald-500/30 bg-card px-5">
            <InfoRow icon={Building2} label="Trade name" value="MDL Digital Support" />
            <InfoRow icon={Briefcase} label="Legal form" value="Entrepreneur Individuel (Sole Trader)" />
            <InfoRow icon={Tag} label="Activity type" value="Unregulated Liberal Activity (LibÃ©rale non rÃ©glementÃ©e)" />
            <InfoRow icon={Hash} label="SIREN" value="989 428 099" />
            <InfoRow icon={Hash} label="APE / NAF code" value="8211Z â€“ Combined Office Administrative Services" />
            <InfoRow icon={MapPin} label="Registered address" value="France â€” full address available on request" />
          </div>
        </section>

        
        <section className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Registration Dates</h2>
          </div>
          <div className="rounded-lg border-2 border-emerald-500/30 bg-card px-5">
            <InfoRow icon={Calendar} label="Activity start date" value="08 July 2025" />
            <InfoRow icon={Calendar} label="RNE registration date" value="18 January 2026" />
          </div>
        </section>

        
        <section className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Activity Description</h2>
          </div>
          <div className="rounded-lg border-2 border-emerald-500/30 bg-card p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Remote service provision focused on customer support and technical assistance for digital platforms,
              online services, and web communities. Handling user requests via tickets, chat, and email: software
              troubleshooting, technical issue resolution, step-by-step guidance. Writing technical documentation
              and user guides. Online community moderation.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              All activities performed exclusively remotely â€” no hardware sales, no physical repairs, no on-site
              intervention.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Helpdesk & Support", "Technical Assistance", "Community Moderation", "Documentation", "Automation (Batch, LUA)", "Remote Only"].map((tag) => (
                <span key={tag} className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
