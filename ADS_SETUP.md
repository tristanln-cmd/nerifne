# Ad Setup — Adsterra

AdSense won't approve (or will pull) ads on `/get-key`, since it's an
ad-gated "checkpoint" page — that's against AdSense's forced-interaction
policy regardless of how it's implemented. Adsterra explicitly serves this
niche (locker/checkpoint/download-gate sites), has no minimum-traffic
requirement, and approval is typically under 10 minutes.

This repo wires up four Adsterra formats, all on `/get-key`:

| Format | Where | Why |
|---|---|---|
| **Social Bar** | site-wide via `AdsterraGlobalUnits`, mounted on `/get-key` | Highest eCPM format for this kind of traffic — interstitial/push style. |
| **Popunder** | same component | Highest raw CPM of any format; one per page max, already respected here. |
| **Banner** (468×60) | `AdsterraBanner`, used in the checkpoint slots | Steady fallback revenue, non-intrusive, good for above/below-fold placements. |
| **Native Banner** | `AdsterraNativeBanner`, mounted on `/get-key` | Blends into the page layout, good complement to the banner slots. |

## 1. Sign up

Go to adsterra.com → **Sign up as a publisher** → add `your-domain.example`
as a site. Verification is near-instant, no minimum traffic.

## 2. Create ad units

In the Adsterra dashboard, **Websites → your site → Add unit**:

- 4x **Banner**, 468×60 → copy each unit's `atOptions.key` value into
  `NEXT_PUBLIC_ADSTERRA_CHECKPOINT_KEY_1..4`
- 1x **Native Banner** → they'll give you an `invoke.js` script tag plus a
  container `<div id="container-...">` — copy the script `src` into
  `NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_SRC` and the container id into
  `NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_CONTAINER_ID`
- 1x **Social Bar** → they'll give you a `<script src="...">` tag; copy the
  full `src` URL into `NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC`
- 1x **Popunder** → same, into `NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC`

The Social Bar / Popunder / Native Banner domains are unique per
publisher/zone (e.g. `pl12345678.somecpmnetwork.com`) — always copy the
exact `src` Adsterra gives you rather than guessing the domain.

## 3. Set the env vars

Add all of the above to `.env.local` (dev) and your host's environment
variables (production) — see `.env.example` for the full list.

## 4. Notes

- Every unit is gated behind the existing ad-consent cookie
  (`site-ad-consent` in `components/CookieConsent.tsx`) — nothing loads
  until the visitor accepts.
- `AdsterraBanner` renders each banner inside its own isolated `<iframe>`.
  Adsterra's banner snippet sets a global `window.atOptions`; without
  isolation, four banners on one page (like `/get-key`) would overwrite
  each other and only the last would show.
- Sanity-check with an ad blocker off, in an incognito tab, after granting
  consent — Adsterra units can take a minute to start serving on a brand
  new zone.
