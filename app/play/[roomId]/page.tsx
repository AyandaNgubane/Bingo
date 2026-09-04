"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { checkWin } from "@/lib/bingo";
import { Player, Room } from "@/lib/types";
import BingoBoard from "@/components/BingoBoard";
import CallerPanel from "@/components/CallerPanel";

export default function Play({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId.toUpperCase();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [quitting, setQuitting] = useState(false);

  useEffect(() => {
    setIsHost(localStorage.getItem(`bingo_host_${roomId}`) === "true");
  }, [roomId]);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: roomData } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
      if (!active) return;
      setRoom(roomData as Room);

      const playerId = localStorage.getItem(`bingo_player_${roomId}`);
      if (playerId) {
        const { data: playerData } = await supabase.from("players").select("*").eq("id", playerId).maybeSingle();
        if (active) setPlayer(playerData as Player);
      }
    }
    load();

    const channel = supabase
      .channel(`play-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
        (payload) => setRoom(payload.new as Room)
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // If the host quits, send everyone (host included) back to the main menu.
  useEffect(() => {
    if (room?.status !== "cancelled") return;
    localStorage.removeItem(`bingo_host_${roomId}`);
    localStorage.removeItem(`bingo_player_${roomId}`);
    const delay = isHost ? 0 : 1600;
    const t = setTimeout(() => router.push("/"), delay);
    return () => clearTimeout(t);
  }, [room?.status, roomId, router, isHost]);

  async function drawNext() {
    if (!room) return;
    const next = room.call_order[room.called_items.length];
    if (!next) return;
    const updated = [...room.called_items, next];
    await supabase.from("rooms").update({ called_items: updated }).eq("id", roomId);
  }

  async function claimBingo() {
    if (!room || !player) return;
    setClaiming(true);
    setClaimMessage(null);

    // Re-fetch the room so the win check runs against the latest called items.
    const { data: freshRoom } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
    const current = (freshRoom as Room) ?? room;

    const won = checkWin(player.board, current.called_items, current.grid_size, current.win_pattern);
    if (!won) {
      setClaimMessage("Not yet — keep an eye on the called items.");
      setClaiming(false);
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .update({ status: "ended", winner_id: player.id, winner_name: player.name })
      .eq("id", roomId)
      .is("winner_id", null);

    if (error) {
      setClaimMessage("Couldn't confirm — try again.");
    }
    setClaiming(false);
  }

  async function quitGame() {
    if (!room) return;
    const confirmed = window.confirm("End the game for everyone and return to the main menu?");
    if (!confirmed) return;
    setQuitting(true);
    await supabase.from("rooms").update({ status: "cancelled" }).eq("id", roomId);
    localStorage.removeItem(`bingo_host_${roomId}`);
    router.push("/");
  }

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-muted">Loading game…</p>
      </main>
    );
  }

  if (room.status === "cancelled") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-muted text-center">
          {isHost ? "Closing the room…" : "The host ended the game. Returning to the main menu…"}
        </p>
      </main>
    );
  }

  const totalItems = room.call_order.length;
  const allCalled = room.called_items.length >= totalItems;
  const roundOver = room.status === "ended";

  return (
    <main className="min-h-screen px-6 py-10">
      {room.status === "ended" && (
        <div className="max-w-lg mx-auto mb-8 rounded-2xl bg-gold text-inkdeep text-center py-6 px-4 shadow-stamp">
          <div className="font-display font-black text-2xl">🎉 {room.winner_name} got BINGO!</div>
          <Link href="/" className="inline-block mt-3 underline font-body text-sm">
            Start a new game
          </Link>
        </div>
      )}

      {isHost ? (
        <>
          <div className="max-w-lg mx-auto flex items-center justify-between mb-6">
            <h1 className="font-display font-bold text-card text-xl">Room {roomId}</h1>
            <button
              onClick={quitGame}
              disabled={quitting}
              className="text-sm text-muted hover:text-dauber border border-card/20 hover:border-dauber/60 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {quitting ? "Ending…" : "Quit game"}
            </button>
          </div>
          <CallerPanel
            calledItems={room.called_items}
            totalItems={totalItems}
            onDraw={drawNext}
            drawDisabled={allCalled || roundOver}
          />
          {room.calling_mode === "manual" && (
            <p className="text-center text-muted text-sm mt-4 max-w-lg mx-auto">
              Manual mode: this list is only visible here.{" "}
              {room.mode === "custom" ? "Play each item yourself" : "Call each item out loud"} —
              players are marking their own boards by ear.
            </p>
          )}
        </>
      ) : player ? (
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-5">
            <div className="text-muted text-sm">{player.name}'s board</div>
            {room.calling_mode === "manual" ? (
              <div className="text-muted text-xs mt-1">
                Listen carefully and tick what you hear — the app won't help this round
              </div>
            ) : (
              <div className="text-muted text-xs mt-1">
                Last called:{" "}
                <span className="text-card font-bold">
                  {room.called_items[room.called_items.length - 1] ?? "—"}
                </span>
              </div>
            )}
          </div>

          <BingoBoard
            board={player.board}
            gridSize={room.grid_size}
            calledItems={room.called_items}
            revealCalls={room.calling_mode !== "manual"}
          />

          <div className="mt-6 max-w-[520px] mx-auto">
            <button
              onClick={claimBingo}
              disabled={claiming || roundOver}
              className="w-full rounded-xl bg-dauber text-card font-display font-bold text-lg py-4 shadow-stamp hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {claiming ? "Checking…" : "BINGO!"}
            </button>
            {claimMessage && <p className="text-center text-muted text-sm mt-3">{claimMessage}</p>}
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">
          Couldn't find your board on this device. Ask the host for the room code and{" "}
          <Link href="/join" className="underline">
            join again
          </Link>
          .
        </p>
      )}
    </main>
  );
}
