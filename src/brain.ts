import {
  BoardPosition,
  FullPosition,
  PositionValue,
  SeriesSummary,
} from "./dtos";
import { aboutToWin, hasAWinner, toBoard } from "./ttt";

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
  if (previousMoves.length === 0) return "0:0";

  const superBoard = toBoard(previousMoves);
  const [currentTurn] = game.currentTurn;
  const currentBoardIndex = Number(
    previousMoves[previousMoves.length - 1].position.split(":")[0]
  ) as BoardPosition;
  const currentBoard = superBoard[currentBoardIndex];
  const availableMoves = game.availableMoves;

  const currentBoardHasWinner: boolean = hasAWinner(currentBoard);
  const winSets = aboutToWin(currentBoard);
  const imWinning = winSets.find((ws) =>
    ws.every((c) => c.value === me || c.value === "empty")
  );

  console.log("am I winning?", imWinning);

  // TODO: return winning move
  const winInner = imWinning?.find((c) => c.value === "empty");
  console.log("winning cell: " + JSON.stringify(winInner));
  if (winInner !== undefined) {
    console.log(`${currentBoardIndex}:${winInner.position}`);
    return `${currentBoardIndex}:${winInner.position}`;
  }
  const almostLosing = winSets.find(
    (ws) =>
      ws.filter((c) => (me === "O" ? c.value === "X" : c.value === "O"))
        .length === 2
  );

  console.log("am I almost losing?", almostLosing);

  const blockInner = almostLosing?.find((c) => c.value === "empty");
  console.log("losing index: " + JSON.stringify(blockInner));
  // TODO: return blocking move
  if (blockInner !== undefined) {
    console.log(`${currentBoardIndex}:${blockInner.position}`);
    return `${currentBoardIndex}:${blockInner.position}`;
  }
};
