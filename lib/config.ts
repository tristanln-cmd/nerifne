export const OPEN_TO_WORK = true
export const MAINTENANCE_MODE = false

export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? ""

export const ADS_ENABLED = true
export const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "ca-pub-5725868827139864"
export const ADSENSE_SIDEBAR_SLOT_ID = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT_ID ?? ""

export const ADSENSE_CHECKPOINT_SLOTS = [
  process.env.NEXT_PUBLIC_ADSENSE_CHECKPOINT_SLOT_1 ?? "",
  process.env.NEXT_PUBLIC_ADSENSE_CHECKPOINT_SLOT_2 ?? "",
  process.env.NEXT_PUBLIC_ADSENSE_CHECKPOINT_SLOT_3 ?? "",
  process.env.NEXT_PUBLIC_ADSENSE_CHECKPOINT_SLOT_4 ?? "",
]

export const ADSTERRA_ENABLED = true

export const ADSTERRA_CHECKPOINT_BANNERS = [
  { adKey: process.env.NEXT_PUBLIC_ADSTERRA_CHECKPOINT_KEY_1 ?? "8acde9673fbbd53949219b4d5e668a64", width: 468, height: 60 },
  { adKey: process.env.NEXT_PUBLIC_ADSTERRA_CHECKPOINT_KEY_2 ?? "8acde9673fbbd53949219b4d5e668a64", width: 468, height: 60 },
  { adKey: process.env.NEXT_PUBLIC_ADSTERRA_CHECKPOINT_KEY_3 ?? "8acde9673fbbd53949219b4d5e668a64", width: 468, height: 60 },
  { adKey: process.env.NEXT_PUBLIC_ADSTERRA_CHECKPOINT_KEY_4 ?? "8acde9673fbbd53949219b4d5e668a64", width: 468, height: 60 },
]

// 300x250 rectangle — separate unit from the 468x60 checkpoint banners above,
// shown once on /get-key (on the success screen, which otherwise carries no ads).
export const ADSTERRA_RECTANGLE_BANNER = {
  adKey: process.env.NEXT_PUBLIC_ADSTERRA_RECTANGLE_KEY ?? "430be82e369da113fd335fa107352249",
  width: 300,
  height: 250,
}

// 160x600 skyscraper — used in the desktop side rails on /get-key during
// checkpoint flows (claim + add-time). You'll need a dedicated Adsterra
// "Banner" unit sized 160x600 for this; until NEXT_PUBLIC_ADSTERRA_SKYSCRAPER_KEY
// is set it just renders the existing dashed placeholder box.
export const ADSTERRA_SKYSCRAPER_BANNER = {
  adKey: process.env.NEXT_PUBLIC_ADSTERRA_SKYSCRAPER_KEY ?? "",
  width: 160,
  height: 600,
}

export const ADSTERRA_NATIVE_BANNER = {
  src: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_SRC ?? "https://pl30536412.effectivecpmnetwork.com/610fc27ea435b7e99560f5192b7985e8/invoke.js",
  containerId: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_CONTAINER_ID ?? "container-610fc27ea435b7e99560f5192b7985e8",
}

export const ADSTERRA_SOCIAL_BAR_SRC =
  process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC ?? "https://pl30536415.effectivecpmnetwork.com/88/a8/cd/88a8cd610ea4d5af7459c1ea1d708346.js"
export const ADSTERRA_POPUNDER_SRC =
  process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC ?? "https://pl30536411.effectivecpmnetwork.com/33/02/8f/33028f81c5f0ab314e9fdb99f7bc9485.js"

export const AVAILABILITY = {
  availableFrom: null as string | null,
  schedule: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as string[],
  responseTime: "< 5 min",
  timezone: "CET (UTC-6)",
}
