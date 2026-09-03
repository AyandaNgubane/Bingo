import { GameMode, WinPattern } from "./types";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 ambiguity

export function generateRoomCode(length = 5): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const FREE_SPACE = "FREE";
const CLASSIC_LETTERS = ["B", "I", "N", "G", "O"];
const CLASSIC_RANGE = 15; // 1-15, 16-30, 31-45, 46-60, 61-75

export function classicFullCallOrder(): string[] {
  const all: string[] = [];
  CLASSIC_LETTERS.forEach((letter, col) => {
    for (let n = 1; n <= CLASSIC_RANGE; n++) {
      all.push(`${letter}${col * CLASSIC_RANGE + n}`);
    }
  });
  return shuffle(all);
}

/** Centre index for an odd-sized square grid, or -1 if not applicable. */
export function centerIndex(gridSize: number): number {
  if (gridSize % 2 === 0) return -1;
  const mid = Math.floor(gridSize / 2);
  return mid * gridSize + mid;
}

export function generateClassicBoard(gridSize: number, freeSpace: boolean): string[] {
  // Standard 5-wide classic bingo: each column drawn from its own number range.
  const cols: string[][] = CLASSIC_LETTERS.map((letter, col) => {
    const rangeStart = col * CLASSIC_RANGE + 1;
    const pool = Array.from({ length: CLASSIC_RANGE }, (_, i) => `${letter}${rangeStart + i}`);
    return shuffle(pool).slice(0, gridSize);
  });

  const board: string[] = [];
  const free = freeSpace ? centerIndex(gridSize) : -1;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      board.push(idx === free ? FREE_SPACE : cols[col][row]);
    }
  }
  return board;
}

export function generateCustomBoard(content: string[], gridSize: number, freeSpace: boolean): string[] {
  const free = freeSpace ? centerIndex(gridSize) : -1;
  const needed = gridSize * gridSize - (free >= 0 ? 1 : 0);
  const pool = shuffle(content).slice(0, needed);

  const board: string[] = [];
  let p = 0;
  for (let i = 0; i < gridSize * gridSize; i++) {
    board.push(i === free ? FREE_SPACE : pool[p++]);
  }
  return board;
}

export function generateBoard(
  mode: GameMode,
  gridSize: number,
  freeSpace: boolean,
  content: string[] | null
): string[] {
  if (mode === "classic75") return generateClassicBoard(gridSize, freeSpace);
  return generateCustomBoard(content ?? [], gridSize, freeSpace);
}

export function buildCallOrder(mode: GameMode, content: string[] | null): string[] {
  if (mode === "classic75") return classicFullCallOrder();
  return shuffle([...new Set(content ?? [])]);
}

export function minContentNeeded(gridSize: number, freeSpace: boolean): number {
  return gridSize * gridSize - (freeSpace && gridSize % 2 === 1 ? 1 : 0);
}

function rows(gridSize: number): number[][] {
  const out: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    out.push(Array.from({ length: gridSize }, (_, c) => r * gridSize + c));
  }
  return out;
}
function cols(gridSize: number): number[][] {
  const out: number[][] = [];
  for (let c = 0; c < gridSize; c++) {
    out.push(Array.from({ length: gridSize }, (_, r) => r * gridSize + c));
  }
  return out;
}
function diagonals(gridSize: number): number[][] {
  const d1 = Array.from({ length: gridSize }, (_, i) => i * gridSize + i);
  const d2 = Array.from({ length: gridSize }, (_, i) => i * gridSize + (gridSize - 1 - i));
  return [d1, d2];
}

export function checkWin(
  board: string[],
  calledItems: string[],
  gridSize: number,
  pattern: WinPattern
): boolean {
  const called = new Set(calledItems);
  const isMarked = (i: number) => board[i] === FREE_SPACE || called.has(board[i]);

  if (pattern === "full_house") {
    return board.every((_, i) => isMarked(i));
  }
  if (pattern === "four_corners") {
    const corners = [0, gridSize - 1, gridSize * (gridSize - 1), gridSize * gridSize - 1];
    return corners.every(isMarked);
  }
  // "line": any full row, column, or diagonal
  const lines = [...rows(gridSize), ...cols(gridSize), ...diagonals(gridSize)];
  return lines.some((line) => line.every(isMarked));
}
