const boardPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export type BoardPosition = (typeof boardPositions)[number];

type ArchivedGame = {
  winner: Winner | "unknown";
  turns: {
    value: PositionValue;
    position: FullPosition;
    lengthSeconds: number;
  }[];
};

export type ArchivedSeries = {
  id: SeriesId;
  name: string;
  archivedAt: Date;
  description: string;
  timeControlSeconds: number;
  games: ArchivedGame[];
};

export type AvailableMoveResponse = {
  turn: TurnInProgress;
  available: FullPosition[];
};

export type CreateSeriesRequest = {
  gameCount: number;
  timeControlSeconds: number;
  seriesName: string;
  description: string;
};

export type FullPosition = `${BoardPosition}:${BoardPosition}`;

export type GameSummary = {
  turnsTaken: number;
  secondsUsed: {
    x: number;
    o: number;
  };
  currentTurn: [PositionValue] | [];
  availableMoves: FullPosition[];
  previousMoves: { value: PositionValue; position: FullPosition }[];
};

export type Cell = { position: BoardPosition; value: PositionValue | "empty" };
//prettier-ignore
export type TicTacToeBoard = [ Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
const defaultCell = (position: BoardPosition): Cell => ({
  position,
  value: "empty",
});
//prettier-ignore
export const defaultBoard = () : TicTacToeBoard => [
  defaultCell(0), defaultCell(1), defaultCell(2),
  defaultCell(3), defaultCell(4), defaultCell(5),
  defaultCell(6), defaultCell(7), defaultCell(8),
];
//prettier-ignore
export type SuperBoard = [ TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard, TicTacToeBoard];
//prettier-ignore
export const defaultSuperBoard = () => [
  defaultBoard(), defaultBoard(), defaultBoard(),
  defaultBoard(), defaultBoard(), defaultBoard(),
  defaultBoard(), defaultBoard(), defaultBoard(),
];

export type IdLookupResponse = {
  id: PlayerId | SeriesId;
  seriesId: SeriesId;
  type: "playerX" | "playerO" | "series";
};

export type PlayerId = string;

export type PositionValue = "X" | "O";

export type SeriesCreated = {
  id: SeriesId;
  playerIds: {
    x: PlayerId;
    o: PlayerId;
  };
  timeControlSeconds: number;
  totalGamesCount: number;
};

export type SeriesId = string;

export type SeriesSummary = {
  id: SeriesId;
  name: string;
  description: string;
  currentGame: [GameSummary] | [];
  timeControlSeconds: number;
  gamesCompletedCount: number;
  totalGamesCount: number;
};

export type TurnInProgress = {
  startTime: Date;
  toMove: PositionValue;
};

type WebHooksSubscription = {
  playerId: PlayerId;
  url: string;
};

export type Winner = "X" | "O" | "CAT";
