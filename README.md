# Bingo Night

Custom-content or classic 75-ball bingo. One person hosts from a laptop or big
screen; everyone else joins from their own phone over the same WiFi and gets
a uniquely shuffled board. The host calls items one at a time and every board
updates live.

## How it works

- **Host** picks custom content (a list of phrases/words) or classic numbers,
  sets the number of players and win condition, and gets a room code + QR.
- **Players** open the site, enter the code (or scan the QR) and their name.
- Once everyone's in, the host taps **Start** — every player gets a random,
  unique board generated from the content.
- The host taps **Draw next** to reveal items one at a time; every player's
  screen updates instantly. Players tap **BINGO!** when they've got it, and
  it's verified against what's actually been called.

Realtime sync is handled by [Supabase](https://supabase.com) (free tier),
which is the piece that makes "join over WiFi" actually work across separate
phones — a browser alone can't reliably do that over Bluetooth or plain WiFi
without a small always-on backend, so this uses one instead. It's free for a
project this size and needs no server of your own to run.

## Setup (no terminal required after this point)

### 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is enough).
2. Once it's created, open **SQL Editor** → **New query**, paste in the contents
   of `supabase/schema.sql` from this project, and run it. This creates the
   two tables the game needs and turns on realtime updates.
3. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public** key — you'll paste these into Vercel next.

### 2. Push this project to GitHub

1. Create a new repository on [github.com](https://github.com) (e.g. `bingo-night`).
2. Use GitHub's web uploader (**Add file → Upload files**) to drag in every
   file and folder from this project, then commit.

### 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
   you just created.
2. Before deploying, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon public key
3. Click **Deploy**. Vercel will detect it's a Next.js app automatically.

That's it — the URL Vercel gives you is what you share as the host link.
Players joining just need the room code; they don't need their own Supabase
account or any setup.

## Playing on the same WiFi

Since the app is a normal website, anyone on the same WiFi (or anywhere with
the link) can open it and join with the room code — no separate local-network
step required. For a room with no internet at all, you'd need a different,
much more limited architecture (a phone-hosted local server); this build
assumes normal home/venue WiFi with internet access, which covers the vast
majority of real party settings.

## Customizing further

- `lib/bingo.ts` — board generation and win-checking logic (line, four
  corners, full house).
- `lib/types.ts` — shared types, including win pattern labels.
- Colors and fonts live in `tailwind.config.ts` and `app/layout.tsx` if you
  want to reskin it later (e.g. a Scripture Sprint-style theme).

## Local development (optional)

If you do want to run it locally at any point:

```
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```
