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
  const latestCall = calledItems[calledItems.length - 1];
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
        const isLatest = revealCalls && !isFree && item === latestCall;
        const isMarked = isFree || marked.has(i);

        let cellStyle = "bg-inkdeep/[0.03] text-inkdeep/50"; // not called
        if (isFree) {
          cellStyle = "bg-gold/25 text-inkdeep font-display font-bold";
        } else if (isLatest) {
          cellStyle =
            "bg-dauber text-card font-bold ring-4 ring-dauber/40 shadow-[0_0_16px_rgba(192,69,58,0.55)]";
        } else if (isCalled) {
          cellStyle = "bg-gold text-inkdeep font-bold shadow-[0_0_10px_rgba(212,162,76,0.45)]";
        }

        return (
          <button
            key={i}
            onClick={() => toggle(i, item)}
            disabled={isFree}
            className={`aspect-square rounded-lg flex items-center justify-center text-center p-1 text-[11px] sm:text-xs font-body leading-tight relative transition-all duration-300 ${cellStyle}`}
          >
            <span className="line-clamp-4">{isFree ? "★" : item}</span>
            {isMarked && !isFree && (
              <span
                className={`absolute inset-1.5 rounded-full border-[3px] pointer-events-none ${
                  isLatest ? "border-card/85" : isCalled ? "border-inkdeep/70" : "border-dauber/80"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
