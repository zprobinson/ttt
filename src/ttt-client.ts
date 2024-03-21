import { PlayerId, SeriesId } from "./dtos";
import {
  createSeries,
  getAvailableMoves,
  lookupId,
  getSeries,
  move,
} from "./clientActions";
import { getPlayer } from "./player";
import { subscribe } from "./socketSubscription";
import { random } from "./test-bot";

const playSeries = (playerId: PlayerId | SeriesId) => {
  lookupId(playerId).then((idLookup) => {
    if (idLookup.type === "series") {
      console.log(
        "I can't do anything with a series id! Computers don't like to watch."
      );
    } else {
      console.log(idLookup);
      const player = getPlayer(
        playerId,
        idLookup.type === "playerX" ? "X" : "O"
      );
      subscribe(playerId, player.onUpdate);
    }
  });
};

const playSeriesRandomly = (playerId: PlayerId | SeriesId) => {
  lookupId(playerId).then((idLookup) => {
    if (idLookup.type === "series") {
      console.log(
        "I can't do anything with a series id! Computers don't like to watch."
      );
    } else {
      console.log(idLookup);
      const player = getPlayer(
        playerId,
        idLookup.type === "playerX" ? "X" : "O"
      );
      subscribe(playerId, random(playerId, player.positionValue));
    }
  });
};

// playSeries('1ebb5402-3fa1-47fd-8649-0c8d56a2ed04'); // X

// playSeries('e4d161b7-95c8-4814-be5a-beb583959d8a'); // O

createSeries(1, 30, "Testing Babye", "")
  .then((sc) => {
    console.log(`Series ${sc.id} created!`);
    console.log(`PlayerX: ${sc.playerIds.x} PlayerO: ${sc.playerIds.o}`);
    setTimeout(() => {
      playSeries(sc.playerIds.x);
      playSeriesRandomly(sc.playerIds.o);
    }, 10000);
  })
  .catch(console.error);
