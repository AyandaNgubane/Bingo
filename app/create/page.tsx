"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { generateRoomCode, minContentNeeded, buildCallOrder } from "@/lib/bingo";
import { GameMode, WinPattern, WIN_PATTERN_LABEL } from "@/lib/types";

export default function CreateGame() {
  const router = useRouter();
  const [mode, setMode] = useState<GameMode>("custom");
  const [contentText, setContentText] = useState("");
  const [gridSize, setGridSize] = useState(5);
  const [freeSpace, setFreeSpace] = useState(true);
  const [winPattern, setWinPattern] = useState<WinPattern>("line");
  const [numPlayers, setNumPlayers] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const contentList = useMemo(
    () =>
      Array.from(
        new Set(
          contentText
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        )
      ),
    [contentText]
  );

  const needed = minContentNeeded(gridSize, freeSpace);
  const oddGrid = gridSize % 2 === 1;

  async function handleCreate() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError(
        "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment (see README)."
      );
      return;
    }
    if (mode === "custom" && contentList.length < needed) {
      setError(`Add at least ${needed} items — you currently have ${contentList.length}.`);
      return;
    }
    if (numPlayers < 1 || numPlayers > 200) {
      setError("Number of players should be between 1 and 200.");
      return;
    }

    setSubmitting(true);
    const id = generateRoomCode();
    const content = mode === "custom" ? contentList : null;
    const callOrder = buildCallOrder(mode, content);

    const { error: insertError } = await supabase.from("rooms").insert({
      id,
      mode,
      content,
      grid_size: gridSize,
      free_space: freeSpace && oddGrid,
      win_pattern: winPattern,
      num_players: numPlayers,
      status: "lobby",
      called_items: [],
      call_order: callOrder,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    localStorage.setItem(`bingo_host_${id}`, "true");
    router.push(`/lobby/${id}`);
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-muted text-sm hover:text-card">
          ← Back
        </Link>
        <h1 className="font-display font-bold text-3xl text-card mt-3 mb-8">Host a game</h1>

        <section className="mb-8">
          <h2 className="font-display font-bold text-card mb-3">Game type</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("custom")}
              className={`rounded-lg py-4 px-3 text-left border-2 transition-colors ${
                mode === "custom"
                  ? "border-gold bg-gold/10 text-card"
                  : "border-card/15 text-muted hover:border-card/30"
              }`}
            >
              <div className="font-display font-bold">Custom content</div>
              <div className="text-sm mt-1">Your own list of words or phrases</div>
            </button>
            <button
              onClick={() => setMode("classic75")}
              className={`rounded-lg py-4 px-3 text-left border-2 transition-colors ${
                mode === "classic75"
                  ? "border-gold bg-gold/10 text-card"
                  : "border-card/15 text-muted hover:border-card/30"
              }`}
            >
              <div className="font-display font-bold">Classic 75-ball</div>
              <div className="text-sm mt-1">Standard B-I-N-G-O numbers</div>
            </button>
          </div>
        </section>

        {mode === "custom" && (
          <section className="mb-8">
            <h2 className="font-display font-bold text-card mb-2">Content list</h2>
            <p className="text-muted text-sm mb-3">
              One item per line. Each board gets a random, unique arrangement. You need at
              least {needed} for a {gridSize}×{gridSize} board.
            </p>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={10}
              placeholder={"Opened a gift before Christmas\nSpilled a drink at a party\nDanced badly on purpose\n..."}
              className="w-full rounded-lg bg-card text-inkdeep p-4 font-body text-sm leading-relaxed border-2 border-transparent focus:border-gold outline-none"
            />
            <div className="text-sm text-muted mt-2">
              {contentList.length} unique item{contentList.length === 1 ? "" : "s"}
            </div>
          </section>
        )}

        <section className="mb-8 grid grid-cols-2 gap-5">
          <div>
            <label className="font-display font-bold text-card block mb-2">Board size</label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full rounded-lg bg-card text-inkdeep p-3 outline-none"
            >
              <option value={3}>3 × 3</option>
              <option value={4}>4 × 4</option>
              <option value={5}>5 × 5 (standard)</option>
            </select>
          </div>
          <div>
            <label className="font-display font-bold text-card block mb-2">Players</label>
            <input
              type="number"
              min={1}
              max={200}
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              className="w-full rounded-lg bg-card text-inkdeep p-3 outline-none"
            />
          </div>
        </section>

        {oddGrid && (
          <section className="mb-8 flex items-center justify-between rounded-lg border-2 border-card/15 px-4 py-3">
            <div>
              <div className="font-display font-bold text-card">Free center space</div>
              <div className="text-sm text-muted">Middle square is automatically marked</div>
            </div>
            <button
              onClick={() => setFreeSpace((v) => !v)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                freeSpace ? "bg-gold" : "bg-card/20"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-inkdeep transition-transform ${
                  freeSpace ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </section>
        )}

        <section className="mb-10">
          <label className="font-display font-bold text-card block mb-2">Win condition</label>
          <select
            value={winPattern}
            onChange={(e) => setWinPattern(e.target.value as WinPattern)}
            className="w-full rounded-lg bg-card text-inkdeep p-3 outline-none"
          >
            {(Object.keys(WIN_PATTERN_LABEL) as WinPattern[]).map((p) => (
              <option key={p} value={p}>
                {WIN_PATTERN_LABEL[p]}
              </option>
            ))}
          </select>
        </section>

        {error && (
          <div className="mb-6 rounded-lg bg-dauber/15 border border-dauber/40 text-card px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={submitting}
          className="w-full rounded-xl bg-gold text-inkdeep font-display font-bold text-lg py-4 shadow-stamp hover:bg-goldbright transition-colors disabled:opacity-60"
        >
          {submitting ? "Creating room…" : "Create room & get code"}
        </button>
      </div>
    </main>
  );
}
