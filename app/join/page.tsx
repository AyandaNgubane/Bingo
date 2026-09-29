"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code")?.toUpperCase() ?? "");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleJoin() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured yet. Ask the host to check the app setup.");
      return;
    }
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError("Enter the room code.");
      return;
    }
    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }

    setSubmitting(true);

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, status, num_players")
      .eq("id", trimmedCode)
      .maybeSingle();

    if (roomError || !room) {
      setError("No game found with that code. Double-check with the host.");
      setSubmitting(false);
      return;
    }
    if (room.status !== "lobby") {
      setError("This game has already started or ended.");
      setSubmitting(false);
      return;
    }

    const { count } = await supabase
      .from("players")
      .select("id", { count: "exact", head: true })
      .eq("room_id", trimmedCode);

    if ((count ?? 0) >= room.num_players) {
      setError("This game is full.");
      setSubmitting(false);
      return;
    }

    const { data: player, error: insertError } = await supabase
      .from("players")
      .insert({ room_id: trimmedCode, name: trimmedName, board: [] })
      .select()
      .single();

    if (insertError || !player) {
      setError(insertError?.message ?? "Couldn't join. Try again.");
      setSubmitting(false);
      return;
    }

    localStorage.setItem(`bingo_player_${trimmedCode}`, player.id);
    router.push(`/lobby/${trimmedCode}`);
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-sm mx-auto">
        <Link href="/" className="text-muted text-sm hover:text-card">
          ← Back
        </Link>
        <h1 className="font-display font-bold text-3xl text-card mt-3 mb-8">Join a game</h1>

        <label className="font-display font-bold text-card block mb-2">Room code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={8}
          placeholder="ABCDE"
          className="w-full rounded-lg bg-card text-inkdeep p-4 text-2xl tracking-[0.3em] text-center font-display font-bold outline-none mb-5"
        />

        <label className="font-display font-bold text-card block mb-2">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="e.g. Thandiwe"
          className="w-full rounded-lg bg-card text-inkdeep p-4 outline-none mb-6"
        />

        {error && (
          <div className="mb-6 rounded-lg bg-dauber/15 border border-dauber/40 text-card px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={submitting}
          className="w-full rounded-xl bg-gold text-inkdeep font-display font-bold text-lg py-4 shadow-stamp hover:bg-goldbright transition-colors disabled:opacity-60"
        >
          {submitting ? "Joining…" : "Join game"}
        </button>
      </div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  );
}
