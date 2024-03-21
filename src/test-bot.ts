import { randomMove } from "./clientActions";
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

export const random =
  (playerId: PlayerId, positionValue: PositionValue) =>
  (summary: SeriesSummary) => {
    let lastGamesCompletedCount = -1; // Mutation!?!?! Noooooooooooooo!
    let lastTurnsCompletedCount = -1;

    if (
      summary.currentGame.length === 0 ||
      summary.currentGame[0].currentTurn.length === 0 ||
      summary.currentGame[0].currentTurn[0] !== positionValue ||
      (lastGamesCompletedCount >= summary.gamesCompletedCount &&
        lastTurnsCompletedCount >= summary.currentGame[0].previousMoves.length)
    ) {
      return;
    }

    lastGamesCompletedCount = summary.gamesCompletedCount;
    lastTurnsCompletedCount = summary.currentGame[0].previousMoves.length;

    const inProgress: SeriesWithTurnInProgress = {
      ...summary,
      currentGame: {
        ...summary.currentGame[0],
        currentTurn: summary.currentGame[0].currentTurn[0],
      },
    };

    randomMove(playerId);
  };
