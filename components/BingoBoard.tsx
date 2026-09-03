"use client";

import { useState } from "react";
import { FREE_SPACE } from "@/lib/bingo";

export default function BingoBoard({
  board,
  gridSize,
  calledItems,
  revealCalls = true,
}: {
  board: string[];
  gridSize: number;
  calledItems: string[];
  /** When false, the board doesn't show or gate on what's been called —
   *  players tap purely on their own judgement (manual / by-ear mode). */
  revealCalls?: boolean;
}) {
  const called = new Set(calledItems);
  const [marked, setMarked] = useState<Set<number>>(new Set());

  function toggle(i: number, item: string) {
    if (item === FREE_SPACE) return;
    if (revealCalls && !called.has(item)) return; // can't daub what hasn't been called
    setMarked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div
      className="grid gap-1.5 sm:gap-2 parlor-card rounded-2xl p-2.5 sm:p-4 shadow-card mx-auto"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, maxWidth: 520 }}
    >
      {board.map((item, i) => {
        const isFree = item === FREE_SPACE;
        const isCalled = isFree || (revealCalls && called.has(item));
        const isMarked = isFree || marked.has(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i, item)}
            disabled={isFree}
            className={`aspect-square rounded-lg flex items-center justify-center text-center p-1 text-[11px] sm:text-xs font-body leading-tight relative transition-colors ${
              isFree
                ? "bg-gold/25 text-inkdeep font-display font-bold"
                : isCalled || !revealCalls
                ? "bg-inkdeep/5 text-inkdeep"
                : "bg-inkdeep/[0.03] text-inkdeep/50"
            }`}
          >
            <span className="line-clamp-4">{isFree ? "★" : item}</span>
            {isMarked && !isFree && (
              <span className="absolute inset-1.5 rounded-full border-[3px] border-dauber/80 pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
}
