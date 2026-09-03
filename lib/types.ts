export type GameMode = "custom" | "classic75";
export type WinPattern = "line" | "four_corners" | "full_house";
export type RoomStatus = "lobby" | "playing" | "ended";
export type CallingMode = "auto" | "manual";

export interface Room {
  id: string;
  mode: GameMode;
  content: string[] | null;
  grid_size: number;
  free_space: boolean;
  win_pattern: WinPattern;
  calling_mode: CallingMode;
  num_players: number;
  status: RoomStatus;
  called_items: string[];
  call_order: string[];
  winner_id: string | null;
  winner_name: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  board: string[];
  joined_at: string;
}

export const WIN_PATTERN_LABEL: Record<WinPattern, string> = {
  line: "Any line (row, column, or diagonal)",
  four_corners: "Four corners",
  full_house: "Full house (blackout)",
};
