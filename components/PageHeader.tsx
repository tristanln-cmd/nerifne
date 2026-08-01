import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  badge?: ReactNode
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ badge, title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("animate-fade-in-up max-w-3xl", className)}>
      {badge}
      <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}

interface SectionHeadingProps {
  title: string
  badge?: string
  right?: ReactNode
  className?: string
}

export function SectionHeading({ title, badge, right, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {badge && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            {badge}
          </span>
        )}
      </div>
      {right}
    </div>
  )
}

export function StatusBadge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "amber" | "muted" }) {
  const tones = {
    default: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
    amber: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    muted: "border-border bg-secondary text-muted-foreground",
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  )
}
