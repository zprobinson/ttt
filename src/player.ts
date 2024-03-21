import { selectMove } from "./brain";
import { move, randomMove } from "./clientActions";
import {
  FullPosition,
  PlayerId,
  PositionValue,
  SeriesId,
  SeriesSummary,
} from "./dtos";

type SeriesWithTurnInProgress = {
  id: SeriesId;
  currentGame: {
    turnsTaken: number;
    secondsUsed: {
      x: number;
      o: number;
    };
    currentTurn: PositionValue;
    availableMoves: FullPosition[];
    previousMoves: { value: PositionValue; position: FullPosition }[];
  };
  timeControlSeconds: number;
  gamesCompletedCount: number;
  totalGamesCount: number;
};

export const getPlayer = (playerId: PlayerId, positionValue: PositionValue) => {
  let lastGamesCompletedCount = -1; // Mutation!?!?! Noooooooooooooo!
  let lastTurnsCompletedCount = -1;

  const onUpdate = (summary: SeriesSummary) => {
    if (summary.gamesCompletedCount > lastGamesCompletedCount) {
      if (summary.gamesCompletedCount < summary.totalGamesCount) {
      } else {
      }
    }
    if (summary.currentGame.length === 0) {
      return;
    }
    if (summary.currentGame[0].currentTurn.length === 0) {
      return;
    }
    if (summary.currentGame[0].currentTurn[0] !== positionValue) {
      return;
    }
    if (
      lastGamesCompletedCount >= summary.gamesCompletedCount &&
      lastTurnsCompletedCount >= summary.currentGame[0].previousMoves.length
    ) {
      return;
    }

    lastGamesCompletedCount = summary.gamesCompletedCount;
    lastTurnsCompletedCount = summary.currentGame[0].previousMoves.length;
    console.log("Game Count: " + lastGamesCompletedCount);
    console.log("Turn Count: " + lastTurnsCompletedCount);

    const inProgress: SeriesWithTurnInProgress = {
      ...summary,
      currentGame: {
        ...summary.currentGame[0],
        currentTurn: summary.currentGame[0].currentTurn[0],
      },
    };

    const targetMove = selectMove(summary, positionValue);
    if (targetMove) {
      console.log("target move is: " + targetMove);
      setTimeout(() => {
        move(playerId, targetMove).catch(() => randomMove(playerId));
      }, 2000);
    } else {
      setTimeout(() => {
        randomMove(playerId);
        // .catch((error) =>console.error(`Error making random move: ${error.message}`));
      }, 5);
    }
  };

  return {
    playerId,
    positionValue,
    onUpdate,
  };
};
