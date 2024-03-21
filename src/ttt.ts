import {
  BoardPosition,
  PositionValue,
  SuperBoard,
  defaultSuperBoard,
} from "./dtos";
import { type Cell, type GameSummary, type TicTacToeBoard } from "./dtos";

export const toBoard = (moves: GameSummary["previousMoves"]): SuperBoard => {
  let board = defaultSuperBoard();
  moves.forEach((move) => {
    const { value, position } = move;
    const [outer, inner] = position
      .split(":")
      .map((x) => Number(x) as BoardPosition);
    board[outer][inner].value = value;
  });
  return board as SuperBoard;
};

type WinSet = [Cell, Cell, Cell];
const rowSets = (b: TicTacToeBoard): WinSet[] => [
  [b[0], b[1], b[2]],
  [b[3], b[4], b[5]],
  [b[6], b[7], b[8]],
];
const colSets = (b: TicTacToeBoard): WinSet[] => [
  [b[0], b[3], b[6]],
  [b[1], b[4], b[7]],
  [b[2], b[5], b[8]],
];
const diaSets = (b: TicTacToeBoard): WinSet[] => [
  [b[0], b[4], b[8]],
  [b[2], b[4], b[6]],
];

export const winSetOptions = (b: TicTacToeBoard): WinSet[] => [
  ...rowSets(b),
  ...colSets(b),
  ...diaSets(b),
];

export const hasAWinner = (b: TicTacToeBoard): boolean => {
  return winSetOptions(b).some(
    (ws) => ws.every((c) => c.value === "X") || ws.every((c) => c.value === "O")
  );
};

export const hasWinOportunity = (
  b: TicTacToeBoard,
  player: PositionValue
): WinSet[] => {
  return winSetOptions(b).filter((ws) =>
    ws.every((c) => c.value === player || c.value === "empty")
  );
};

// a function that takes in a WinSet[] and returns a map of each position to the number of winning sets it is a part of
export const winSetCount = (winSets: WinSet[]): Map<BoardPosition, number> => {
  const counts = new Map<BoardPosition, number>();
  winSets.forEach((ws) => {
    ws.forEach((c) => {
      if (c.value === "empty") {
        const currentCount = counts.get(c.position) || 0;
        counts.set(c.position, currentCount + 1);
      }
    });
  });
  return counts;
};

export const winningOptions = (
  b: TicTacToeBoard,
  player: PositionValue
): WinSet[] => {
  return winSetOptions(b).filter(
    (ws) =>
      ws.filter((c) => c.value === player).length === 2 &&
      ws.every((c) => c.value === player || c.value === "empty")
  );
};

export const aboutToWin = (b: TicTacToeBoard): WinSet[] => {
  const options = winSetOptions(b);
  const aboutWinImpl = (ws: WinSet): boolean => {
    if (!ws.some((c) => c.value === "empty")) return false;

    const xAboutToWin = ws.filter((c) => c.value === "X").length === 2;
    const oAboutToWin = ws.filter((c) => c.value === "O").length === 2;

    return xAboutToWin || oAboutToWin;
  };

  return options.filter(aboutWinImpl);
};

export const printb = (b: TicTacToeBoard): string => {
  const x = b.map((c) => (c.value === "empty" ? " " : c.value));
  return `${x[0]} | ${x[1]} | ${x[2]}\n---|---|---\n ${x[3]} | ${x[4]} | ${x[5]}\n---|---|---\n ${x[6]} | ${x[7]} | ${x[8]}`;
};

export const printsb = (sb: SuperBoard): string => {
  return sb.map(printb).join("\n\n");
};
