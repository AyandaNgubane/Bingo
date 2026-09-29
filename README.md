# Bingo Night

Custom-content or classic 75-ball bingo. One person hosts from a laptop or big
screen; everyone else joins from their own phone over the same WiFi and gets
a uniquely shuffled board. The host calls items one at a time and every board
updates live.

## How it works

- **Host** picks custom content (a list of phrases/words, with ready-made
  Pentecostal/Christian content packs to drop in) or classic numbers, sets
  the number of players, win condition, and how calls happen, and gets a
  room code + QR.
- **Calling mode**: **Auto-reveal** highlights each call on every player's
  board automatically. **Manual / by ear** only shows the current item on
  the host's screen — good for a song round (you play the track yourself)
  or calling classic numbers out loud — and players tick their own board
  based on what they hear.
- **Players** open the site, enter the code (or scan the QR) and their name.
- Once everyone's in, the host taps **Start** — every player gets a random,
  unique board generated from the content.
- The host taps **Draw next** to reveal items one at a time. Players tap
  **BINGO!** when they've got it, and it's verified against what's actually
  been called — not just what they've personally ticked, so a manual-mode
  guess can't accidentally win.
- Either the host or a player can back out safely: pressing the browser/
  device back button (or an explicit "Quit"/"Leave" button) brings up a
  confirmation prompt and pauses the game's controls until it's answered.
  If the host confirms, the room closes and everyone is sent back to the
  main menu.

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
   two tables the game needs and turns on realtime updates. It's safe to
   re-run any time you update this file later — it only adds what's missing.
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

If you add environment variables *after* an initial deploy, they won't take
effect until you trigger **Deployments → (latest) → Redeploy**.

## Playing on the same WiFi

Since the app is a normal website, anyone on the same WiFi (or anywhere with
the link) can open it and join with the room code — no separate local-network
step required. For a room with no internet at all, you'd need a different,
much more limited architecture (a phone-hosted local server); this build
assumes normal home/venue WiFi with internet access, which covers the vast
majority of real party settings.

## A couple of honest limitations

- There are no user accounts — anyone with a room code can read/write that
  room's data. Fine for a casual game, but don't put anything sensitive in
  the content list.
- In manual/by-ear calling mode, the list of what's been called isn't
  *rendered* on a player's screen, but it technically still reaches their
  browser in the background (that's how live sync works without a login
  system). A player who opened their browser's developer tools could dig it
  out. For real family/friends game night this isn't a practical concern;
  it just isn't cheat-proof against a determined technical player.

## Customizing further

- `lib/bingo.ts` — board generation and win-checking logic (line, four
  corners, full house).
- `lib/types.ts` — shared types, including win pattern and calling mode labels.
- `lib/contentPacks.ts` — the built-in Christian/Gospel content packs; add
  your own pack objects here to offer more one-click content sets.
- Colors and fonts live in `tailwind.config.ts` and `app/layout.tsx` if you
  want to reskin it later.

## Local development (optional)

If you do want to run it locally at any point:

```
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```
