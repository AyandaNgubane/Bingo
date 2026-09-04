import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 text-gold mb-4">
          <span className="h-px w-8 bg-gold/60" />
          <span className="text-sm tracking-wide">B · I · N · G · O</span>
          <span className="h-px w-8 bg-gold/60" />
        </div>
        <h1 className="font-display font-black text-5xl sm:text-6xl leading-[0.95] text-card mb-4">
          Bingo Night
        </h1>
        <p className="text-muted text-lg mb-12">
          Bring your own questions, prizes, or inside jokes. Everyone gets a different
          board, called live from one screen to every phone in the room.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/create"
            className="rounded-xl bg-gold text-inkdeep font-display font-bold text-lg py-4 shadow-stamp hover:bg-goldbright transition-colors"
          >
            Host a game
          </Link>
          <Link
            href="/join"
            className="rounded-xl border-2 border-card/25 text-card font-display font-bold text-lg py-4 hover:border-card/50 hover:bg-card/5 transition-colors"
          >
            Join a game
          </Link>
        </div>

        <p className="text-muted text-sm mt-10">
          Players join over your WiFi — no app to install, just a room code.
        </p>
      </div>
    </main>
  );
}
