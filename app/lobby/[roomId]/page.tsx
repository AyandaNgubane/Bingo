"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { generateBoard } from "@/lib/bingo";
import { useBackGuard } from "@/lib/useBackGuard";
import { Player, Room } from "@/lib/types";
import PlayerList from "@/components/PlayerList";
import QRCodeBlock from "@/components/QRCodeBlock";
import QuitConfirmModal from "@/components/QuitConfirmModal";

export default function Lobby({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId.toUpperCase();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState("");
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    setIsHost(localStorage.getItem(`bingo_host_${roomId}`) === "true");
    setJoinUrl(`${window.location.origin}/join?code=${roomId}`);
  }, [roomId]);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: roomData } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
      const { data: playerData } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });
      if (!active) return;
      setRoom(roomData as Room);
      setPlayers((playerData ?? []) as Player[]);
    }
    load();

    const channel = supabase
      .channel(`lobby-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
        (payload) => setRoom(payload.new as Room)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (room?.status === "cancelled") {
      localStorage.removeItem(`bingo_host_${roomId}`);
      localStorage.removeItem(`bingo_player_${roomId}`);
      router.push("/");
    } else if (room?.status === "playing" || room?.status === "ended") {
      router.push(`/play/${roomId}`);
    }
  }, [room?.status, roomId, router]);

  // Trap back navigation while waiting in the lobby, and show our own prompt.
  const lobbyLive = !!room && room.status === "lobby";
  useBackGuard(lobbyLive, () => setShowQuitConfirm(true));

  async function startGame() {
    if (!room) return;
    setError(null);
    setStarting(true);

    const boardsByPlayer = players.map((p) => ({
      id: p.id,
      board: generateBoard(room.mode, room.grid_size, room.free_space, room.content),
    }));

    const results = await Promise.all(
      boardsByPlayer.map((b) => supabase.from("players").update({ board: b.board }).eq("id", b.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setError(failed.error.message);
      setStarting(false);
      return;
    }

    const { error: roomErr } = await supabase.from("rooms").update({ status: "playing" }).eq("id", roomId);
    if (roomErr) {
      setError(roomErr.message);
      setStarting(false);
    }
  }

  async function confirmQuit() {
    setActionBusy(true);
    if (isHost) {
      await supabase.from("rooms").update({ status: "cancelled" }).eq("id", roomId);
      localStorage.removeItem(`bingo_host_${roomId}`);
      router.push("/");
    } else {
      const playerId = localStorage.getItem(`bingo_player_${roomId}`);
      if (playerId) {
        await supabase.from("players").delete().eq("id", playerId);
      }
      localStorage.removeItem(`bingo_player_${roomId}`);
      router.push("/");
    }
  }

  function resume() {
    setShowQuitConfirm(false);
  }

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-muted">Loading room…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <QuitConfirmModal
        open={showQuitConfirm}
        title={isHost ? "Close this room?" : "Leave the lobby?"}
        message={
          isHost
            ? "This will close the room for everyone waiting and send them back to the main menu."
            : "You'll be removed from this game's player list. You can rejoin with the room code."
        }
        confirmLabel={isHost ? "Yes, close room" : "Yes, leave"}
        cancelLabel="No, stay"
        onConfirm={confirmQuit}
        onCancel={resume}
        busy={actionBusy}
      />

      <div className="max-w-lg mx-auto text-center">
        <div className="text-muted text-sm mb-1">
          {room.mode === "classic75" ? "Classic 75-ball bingo" : "Custom bingo"}
        </div>
        <h1 className="font-display font-black text-card text-2xl mb-8">
          {isHost ? "Your game is ready" : "You're in the lobby"}
        </h1>

        <div className="mb-8">
          <div className="text-muted text-xs uppercase tracking-widest mb-2">Room code</div>
          <div className="font-display font-black text-6xl text-gold tracking-[0.15em]">{roomId}</div>
        </div>

        {isHost && (
          <div className="mb-10 flex flex-col items-center gap-3">
            <QRCodeBlock url={joinUrl} />
            <p className="text-muted text-sm">Scan on the same WiFi, or go to /join and enter the code</p>
          </div>
        )}

        <div className="parlor-card rounded-2xl p-6 shadow-card mb-8 text-left">
          <PlayerList players={players} capacity={room.num_players} />
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-dauber/15 border border-dauber/40 text-card px-4 py-3 text-sm text-left">
            {error}
          </div>
        )}

        {isHost ? (
          <>
            <button
              onClick={startGame}
              disabled={starting || players.length === 0}
              className="w-full rounded-xl bg-gold text-inkdeep font-display font-bold text-lg py-4 shadow-stamp hover:bg-goldbright transition-colors disabled:opacity-50"
            >
              {starting ? "Dealing boards…" : players.length === 0 ? "Waiting for players…" : "Start game"}
            </button>
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="w-full mt-3 text-sm text-muted hover:text-dauber transition-colors"
            >
              Cancel & close room
            </button>
          </>
        ) : (
          <>
            <p className="text-muted">Waiting for the host to start the game…</p>
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="text-sm text-muted hover:text-dauber underline mt-4"
            >
              Leave lobby
            </button>
          </>
        )}
      </div>
    </main>
  );
}
