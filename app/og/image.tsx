import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Mathis â€“ Professional Support Agent"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "oklch(0.12 0.01 260)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
            top: "-100px",
            right: "-100px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "3px solid rgba(96,165,250,0.4)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <img
              src="https://nerfine.xyz/images/nerfine-pfp.png"
              width={100}
              height={100}
              alt="Mathis"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(96,165,250,0.12)",
              border: "1px solid rgba(96,165,250,0.35)",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "13px",
              color: "rgb(96,165,250)",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "rgb(96,165,250)",
              }}
            />
            Open to new positions
          </div>

          <div style={{ fontSize: "72px", fontWeight: 800, color: "white", letterSpacing: "-2px" }}>
            Mathis
          </div>

          <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)", marginTop: "-12px" }}>
            Professional Support Agent
          </div>

          <div style={{ display: "flex", gap: "32px", marginTop: "8px" }}>
            {[
              ["100,000+", "Users served"],
              ["50+/day", "Peak tickets"],
              ["3", "Languages"],
              ["3", "Concurrent roles"],
            ].map(([val, lbl]) => (
              <div
                key={lbl}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "22px", fontWeight: 700, color: "rgb(96,165,250)" }}>{val}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "40px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "1px",
          }}
        >
          nerfine.xyz
        </div>
      </div>
    ),
    { ...size }
  )
}
