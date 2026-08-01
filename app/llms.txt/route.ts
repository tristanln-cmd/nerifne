export async function GET() {
  const base = "https://nerfine.xyz"

  const body = `# Mathis

> Mathis is a professional support agent based in France.

## Professional profile
- [Home](${base}/): Mathis's professional support-agent profile and background.
- [Services](${base}/services): Support, moderation, and automation services offered.
- [Positions](${base}/positions): Roles and experience.
- [Rates](${base}/rates): Pricing for professional services.
- [FAQ](${base}/faq): Frequently asked questions.
- [Contact](${base}/contact): How to get in touch.
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
