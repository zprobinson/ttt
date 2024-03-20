import type { Cell, PositionValue, TicTacToeBoard } from "./dtos";

/*
row: [x, x, x] x 3
column:
[x, _, _
 x, _, _
 x, _, _] x 3
diagonalRL:
[x, _, _
 _, x, _
 _, _, x]
diagonalLR:
[_, _, x
 _, x, _
 x, _, _]
*/

type WinSet = [Cell, Cell, Cell];
const rowSets = (b: TicTacToeBoard): WinSet[] => [b[0], b[1], b[2]];
const colSets = (b: TicTacToeBoard): WinSet[] => [
  [b[0][0], b[1][0], b[2][0]],
  [b[0][1], b[1][1], b[2][1]],
  [b[0][2], b[1][2], b[2][2]],
];
const diaSets = (b: TicTacToeBoard): WinSet[] => [
  [b[0][0], b[1][1], b[2][2]],
  [b[0][2], b[1][1], b[2][0]],
];

export const winSetOptions = (b: TicTacToeBoard): WinSet[] => [
  ...rowSets(b),
  ...colSets(b),
  ...diaSets(b),
];

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
