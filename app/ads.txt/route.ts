import { ADSENSE_PUBLISHER_ID } from "@/lib/config"

export async function GET() {
  const pubId = ADSENSE_PUBLISHER_ID.replace(/^ca-/, "")

  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
