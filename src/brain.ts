import {
  BoardPosition,
  FullPosition,
  PositionValue,
  SeriesSummary,
} from "./dtos";
import {
  aboutToWin,
  hasAWinner,
  printb,
  printsb,
  toBoard,
  winningOptions,
} from "./ttt";

export const selectMove = (
  summary: SeriesSummary,
  me: PositionValue
): FullPosition | undefined => {
  const {
    id,
    name,
    description,
    currentGame,
    timeControlSeconds,
    gamesCompletedCount,
    totalGamesCount,
  } = summary;

  const game = currentGame[0];
  if (game === undefined) {
    console.log(`No game in progress for series ${id}. I'm so scared!`);
    return;
  }

  const previousMoves = game.previousMoves;
  if (previousMoves.length === 0) return "4:4";

  const superBoard = toBoard(previousMoves);
  const currentBoardIndex = game.availableMoves.map(
    (move) => Number(move.split(":")[0]) as BoardPosition
  )[0];
  const currentBoard = superBoard[currentBoardIndex];
  //   console.log("super board\n", printsb(superBoard));
  console.log("current board\n", printb(currentBoard));

  const availableMoves = game.availableMoves;

  const currentBoardHasWinner: boolean = hasAWinner(currentBoard);
  console.log("currentBoardHasWinner: " + currentBoardHasWinner);

  const opponent = me === "X" ? "O" : "X";
  const myWinningOptions = winningOptions(currentBoard, me);
  const opponentWinningOptions = winningOptions(currentBoard, opponent);

  console.log("am I winning?", JSON.stringify(myWinningOptions));

  // TODO: return winning move
  if (myWinningOptions.length > 0) {
    const defaultOption = myWinningOptions[0];
    const winInner = defaultOption.find((c) => c.value === "empty")!;

    console.log(`${currentBoardIndex}:${winInner.position}`);
    return `${currentBoardIndex}:${winInner.position}`;
  }

  console.log("am I almost losing?", JSON.stringify(opponentWinningOptions));

  // TODO: return blocking move
  if (opponentWinningOptions.length > 0) {
    const defaultOption = opponentWinningOptions[0];
    const blockInner = defaultOption.find((c) => c.value === "empty")!;

    console.log(`${currentBoardIndex}:${blockInner.position}`);
    return `${currentBoardIndex}:${blockInner.position}`;
  }
};
