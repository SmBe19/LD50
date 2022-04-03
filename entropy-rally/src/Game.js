import {INVALID_MOVE, TurnOrder} from "boardgame.io/core";
import {EntropyRallyAi} from "./Ai";
import {GetCardPile} from "./Cards";
import {GetTilePile, START_TILE} from "./Tiles";
import {getBorderTiles} from "./TileBoard";

function Setup(ctx) {
    return {
        entropy: -1000,
        tilePile: ctx.random.Shuffle(GetTilePile()),
        cardPile: ctx.random.Shuffle(GetCardPile()),
        startingPlayer: 0,
        lastShipId: 0,
        players: Array(ctx.numPlayers).fill({
            score: 0,
            cards: [],
            unspentEnergy: 0,
            finishedPlanning: false,
            ships: [],
        }),
        tiles: [TileAt(START_TILE, 0, 0)],
    };
}

function TileAt(tile, x, y) {
    return {
        tile,
        x,
        y,
    }
}

function CreateShip(G, player, x, y) {
    G.lastShipId++;
    return {
        id: G.lastShipId,
        player,
        x,
        y,
        rotation: 0, // TODO maybe the player should be able to choose this?
        energy: 0,
        titanium: 0,
        plannedCards: [],
    }
}

const ONCE_SP = {
    first: (G, ctx) => G.startingPlayer,
    next: (G, ctx) => {
        const nextPlayer = (ctx.playOrderPos + 1) % ctx.numPlayers;
        if (nextPlayer !== G.startingPlayer) {
            return nextPlayer;
        }
    }
}

const ONLY_SP = {
    first: (G, ctx) => G.startingPlayer,
    next: (G, ctx) => undefined,
}

function AdjustEntropy(G, ctx, change) {
    if (G.entropy === 0 || change === 0) {
        return;
    }
    G.entropy = Math.min(0, G.entropy + change);
}

function PlaceTile(G, ctx, x, y) {
    if (getBorderTiles(G).filter(tile => tile.x === x && tile.y === y).length === 0) {
        return INVALID_MOVE;
    }
    const tile = G.tilePile.pop();
    G.tiles.push(TileAt(tile, x, y));
    AdjustEntropy(G, ctx, tile.entropyChange);
}

function PlaceInitShip(G, ctx, x, y) {
    // TODO check that it is not adjacent to other ship
    G.players[ctx.playOrderPos].ships.push(CreateShip(G, ctx.playOrderPos, x, y));
}

function PerformProduction(G, ctx) {
    // TODO draw cards
    // TODO handle energy portals
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i].unspentEnergy += 10;
    }
}

function DistributeEnergy(G, ctx, shipID, amount) {
    if (G.players[ctx.playOrderPos].unspentEnergy < amount) {
        return INVALID_MOVE;
    }
    const ship = G.players[ctx.playOrderPos].ships.filter(ship => ship.id === shipID).at(0);
    if (!ship) {
        return INVALID_MOVE;
    }
    ship.energy += amount;
    G.players[ctx.playOrderPos].unspentEnergy -= amount;
}

function PlanCard(G, ctx) {

}

function FinishPlanning(G, ctx) {

}

function MoveLasers(G, ctx) {

}

function PlayCard(G, ctx) {

}

function AllShipsFinished(G, ctx) {

}

function CheckEndgame(G, ctx) {
    if (!AllShipsFinished(G, ctx)) {
        return;
    }
    if (G.entropy === 0) {
        let winner = 0;
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (G.players[i].score > G.players[winner].score) {
                winner = i;
            }
        }
        ctx.events.endGame({winner});
    }
}

function NextStartingPlayer(G, ctx) {
    G.startingPlayer = (G.startingPlayer + 1) % ctx.numPlayers;
}

export const EntropyRally = {
    setup: Setup,
    moves: {},
    phases: {
        initTiles: {
            moves: {PlaceTile},
            turn: {
                minMoves: 1,
                maxMoves: 1,
            },
            endIf: (G, ctx) => (G.tiles.length === 1 + 1 * ctx.numPlayers), // TODO change to 5 per player
            next: 'initShips',
            start: true,
        },
        initShips: {
            moves: {PlaceInitShip},
            turn: {
                order: TurnOrder.ONCE,
                minMoves: 1,
                maxMoves: 1,
            },
            next: 'production',
        },
        production: {
            onBegin: PerformProduction,
            moves: {DistributeEnergy},
            turn: {
                order: ONCE_SP,
                endIf: (G, ctx) => (G.players[ctx.playOrderPos].unspentEnergy === 0),
            },
            next: 'planning',
        },
        planning: {
            // TODO set all players active at the same time
            moves: {PlanCard, FinishPlanning},
            turn: {
                order: ONCE_SP,
                endIf: (G, ctx) => (G.players[ctx.playOrderPos].finishedPlanning),
            },
            next: 'chaos',
        },
        chaos: {
            // TODO end turn once a player can no longer play
            onBegin: MoveLasers,
            moves: {PlayCard},
            next: (G, ctx) => {
                return AllShipsFinished(G, ctx) ? 'expansion' : 'chaos';
            },
            onEnd: CheckEndgame,
        },
        expansion: {
            moves: {PlaceTile},
            turn: {
                minMoves: 3,
                maxMoves: 3,
                order: ONLY_SP,
            },
            next: 'production',
            onEnd: NextStartingPlayer,
        },
    },
    ai: EntropyRallyAi,
}
