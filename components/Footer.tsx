import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
      <p>Multi-platform support specialist based in France</p>
      <a
        href="https://nerfine.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-primary hover:underline"
      >
        nerfine.xyz
      </a>
      <div className="mt-4 text-xs text-muted-foreground/50">
        <p>MDL Digital Support · SIREN 989 428 099</p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <Link
            href="/legal"
            className="inline-block text-muted-foreground/50 hover:text-muted-foreground transition-colors hover:underline"
          >
            Legal information →
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link
            href="/privacy"
            className="inline-block text-muted-foreground/50 hover:text-muted-foreground transition-colors hover:underline"
          >
            Privacy &amp; cookies →
          </Link>
        </div>
      </div>
    </footer>
  )
}
