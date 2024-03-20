import { BoardPosition, SuperBoard, defaultSuperBoard } from "./dtos";
import {
  defaultBoard,
  type Cell,
  type GameSummary,
  type PositionValue,
  type TicTacToeBoard,
} from "./dtos";

export const toBoard = (moves: GameSummary["previousMoves"]): SuperBoard => {
  let board = defaultSuperBoard;
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
