# Supabase Setup Guide

This guide walks you through setting up Supabase so plugin licenses persist
permanently and survive redeploys.

---

## Step 1 — Create a Supabase project

1. Go to https://supabase.com and sign up (free tier is plenty)
2. Click **New project**, give it a name, choose a region close to your users
3. Set a strong database password — save it somewhere safe
4. Wait ~2 minutes for the project to provision

---

## Step 2 — Create the `plugin_licenses` table

In the Supabase dashboard, go to **SQL Editor** (left sidebar) and paste
then run:

```sql
create table if not exists plugin_licenses (
  id                    uuid primary key default gen_random_uuid(),
  key                   text not null unique,
  plugin                text not null,
  customer_email        text,
  note                  text,
  expires_at            timestamptz,
  max_activations       int not null default 1,
  activation_count      int not null default 0,
  revoked               boolean not null default false,
  seen_roblox_user_ids  jsonb not null default '[]',
  claimed_ip            text,
  last_validated_at     timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists plugin_licenses_key_idx on plugin_licenses (key);
create index if not exists plugin_licenses_claimed_ip_idx on plugin_licenses (claimed_ip, plugin, revoked);

alter table plugin_licenses enable row level security;
-- No public policies: only ever touched via the service-role client in
-- app/api/plugin-license/** routes, which bypasses RLS entirely.
```

Click **Run** — you should see "Success".

> **Already have this table from before?** `create table if not exists`
> won't add the new `claimed_ip` column to an existing table. Run this
> once in the SQL Editor to add it (safe to re-run):
>
> ```sql
> alter table plugin_licenses add column if not exists claimed_ip text;
> create index if not exists plugin_licenses_claimed_ip_idx on plugin_licenses (claimed_ip, plugin, revoked);
> ```

---

## Step 3 — Get your API keys

In Supabase dashboard → **Settings → API**:

| Key | Where to find it |
|-----|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" field |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "Project API keys → anon public" |
| `SUPABASE_SERVICE_ROLE_KEY` | "Project API keys → service_role" (keep secret!) |

---

## Step 4 — Set environment variables

### On Vercel (production)
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each of these:

```
NEXT_PUBLIC_SUPABASE_URL        = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
PLUGIN_LICENSE_ADMIN_TOKEN      = (generate a strong random token, e.g. openssl rand -hex 32)
OWNER_EMAIL                     = you@example.com
MAINTENANCE_BYPASS_SECRET       = (generate a strong random token, only needed if you use maintenance mode)
RESEND_API_KEY                  = re_...
CRON_SECRET                     = (generate a strong random token, e.g. openssl rand -hex 32)
```

3. Redeploy after adding them

### Local development
Create a `.env.local` file in the project root (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PLUGIN_LICENSE_ADMIN_TOKEN=your-secret-token
OWNER_EMAIL=you@example.com
RESEND_API_KEY=re_...
```

---

## Keeping Supabase awake (free tier auto-pause) + purging expired keys

Free Supabase projects pause themselves after about a week with no API
traffic. Rather than logging in to manually "unpause" it, the project ships
an endpoint that generates real traffic on a schedule and does one bit of
housekeeping while it's at it: `GET /api/cron/keepalive`.

Each call:

1. Writes a tiny timestamped file to a `keepalive` storage bucket (created
   automatically on first run) and reads back its public URL — real Storage
   + API activity, which resets the auto-pause timer.
2. Deletes every row in `plugin_licenses` whose `expires_at` has passed.

It's protected by a shared secret so randoms can't spam it or trigger the
delete early:

1. Set `CRON_SECRET` in your environment (see Step 4 above) —
   `openssl rand -hex 32` works fine.
2. The endpoint accepts the secret three ways: `?secret=...` query param,
   an `x-cron-secret` header, or `Authorization: Bearer ...`.

### Option A — Vercel Cron (already wired up)

`vercel.json` in this repo defines a daily cron hitting
`/api/cron/keepalive`. Vercel automatically sends
`Authorization: Bearer <CRON_SECRET>` as long as the `CRON_SECRET` env var
is set on the project — nothing else to configure. Note Hobby plan crons
only run once a day; that's enough to dodge the ~7 day auto-pause window,
but pair it with Option B below if you also want real uptime monitoring
out of it.

### Option B — External uptime monitor (recommended, gives you monitoring too)

This turns the keepalive call into a real uptime check for the whole site,
not just a cron ping. Any of these work (all have free tiers): UptimeRobot,
Better Uptime, Freshping, cron-job.org, healthchecks.io.

Using **UptimeRobot** as an example:

1. Sign up / log in at uptimerobot.com
2. **Add New Monitor** → Monitor Type: `HTTP(s)`
3. Friendly Name: `nerfine keepalive`
4. URL:
   `https://your-domain.example/api/cron/keepalive?secret=YOUR_CRON_SECRET`
5. Monitoring Interval: every 30 min (free plan minimum) — comfortably
   under Supabase's ~7 day pause window
6. Save. UptimeRobot will now hit the endpoint on schedule; check the
   response body in its logs to confirm `"success": true`.

Do **not** put the secret in a monitor whose logs/status page you plan to
make public — treat that URL like a credential.
