import { Player } from "@/lib/types";

export default function PlayerList({ players, capacity }: { players: Player[]; capacity: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-bold text-card">Players</h2>
        <span className="text-muted text-sm">
          {players.length} / {capacity}
        </span>
      </div>
      {players.length === 0 ? (
        <p className="text-muted text-sm">Waiting for the first player to join…</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="rounded-lg bg-card/10 border border-card/15 px-3 py-2 text-card text-sm truncate"
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
