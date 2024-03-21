import {
  BoardPosition,
  FullPosition,
  PositionValue,
  SeriesSummary,
} from "./dtos";
import {
  hasAWinner,
  hasWinOportunity,
  printb,
  toBoard,
  winSetCount,
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

  const availableBoards = game.availableMoves.map(
    (move) => Number(move.split(":")[0]) as BoardPosition
  );
  const distinctAvailableBoards = availableBoards.filter(
    (n, i) => availableBoards.indexOf(n) === i
  );

  const currentBoardAndIndex = distinctAvailableBoards
    .map((index) => ({ index: index, board: superBoard[index] }))
    .sort((board) => 10 - winningOptions(board.board, me).length)[0];

  const currentBoard = currentBoardAndIndex.board;
  const currentBoardIndex = currentBoardAndIndex.index;
  //const currentBoard = superBoard[currentBoardIndex];
  //   console.log("super board\n", printsb(superBoard));
  console.log("current board\n", printb(currentBoard));

  const availableMoves = game.availableMoves;

  const currentBoardHasWinner: boolean = hasAWinner(currentBoard);
  console.log("currentBoardHasWinner: " + currentBoardHasWinner);

  const opponent = me === "X" ? "O" : "X";
  const myWinningOptions = winningOptions(currentBoard, me);
  const opponentWinningOptions = winningOptions(currentBoard, opponent);

  console.log("am I winning?", JSON.stringify(myWinningOptions));

  if (myWinningOptions.length > 0) {
    const defaultOption = myWinningOptions[0];
    const winInner = defaultOption.find((c) => c.value === "empty")!;

    console.log(`${currentBoardIndex}:${winInner.position}`);
    return `${currentBoardIndex}:${winInner.position}`;
  }

  console.log("am I almost losing?", JSON.stringify(opponentWinningOptions));

  if (opponentWinningOptions.length > 0) {
    const defaultOption = opponentWinningOptions[0];
    const blockInner = defaultOption.find((c) => c.value === "empty")!;

    console.log(`${currentBoardIndex}:${blockInner.position}`);
    return `${currentBoardIndex}:${blockInner.position}`;
  }

  // TODO: Best move based on best chances in current board.
  const allPotentialWinningSets = hasWinOportunity(currentBoard, me);
  console.log(
    "are there any win sets that I should target?",
    JSON.stringify(allPotentialWinningSets)
  );

  if (allPotentialWinningSets.length > 0) {
    const bestOptions = winSetCount(allPotentialWinningSets);
    const sorted = [...bestOptions.entries()].sort((a, b) => b[1] - a[1]);
    const rnd = Math.random();
    rnd < 0.3 && console.log("selected 1st sorted option");
    const bestOption = rnd < 0.3 ? sorted[0] : sorted[1];
    // const bestOption = [...bestOptions.entries()].reduce((a, b) =>
    //   a[1] > b[1] ? a : b
    // );

    console.log("best option", JSON.stringify(bestOption));
    console.log(`${currentBoardIndex}:${bestOption[0]}`);
    return `${currentBoardIndex}:${bestOption[0]}`;
  }
};
