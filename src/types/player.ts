export type Symbol = "x" | "o";

export interface CurrentPlayer {
  symbol: Symbol;
  color: string;
  ia: boolean;
}
