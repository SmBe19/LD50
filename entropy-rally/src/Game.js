import {INVALID_MOVE, TurnOrder} from "boardgame.io/core";
import {EntropyRallyAi} from "./Ai";

function Setup(ctx) {
    return {
        entropy: -1000,
        tilePile: [], // TODO all all tiles and shuffle
        cardPile: [], // TODO add all cards and shuffle
        players: Array(ctx.numPlayers).fill({
            score: 0,
            cards: [],
            unspentEnergy: 0,
            finishedPlanning: false,
            ships: [],
        }),
        tiles: [],
    };
}

function AdjustEntropy(G, ctx, change) {
    if (G.entropy === 0) {
        return;
    }
    G.entropy = Math.min(0, G.entropy + change);
}

function PlaceTile(G, ctx) {

}

function PlaceInitShip(G, ctx) {

}

function PerformProduction(G, ctx) {
    // TODO draw cards
    // TODO handle energy portals
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i].unspentEnergy += 10;
    }
}

function DistributeEnergy(G, ctx) {
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

// TODO correctly set starting player

export const EntropyRally = {
    setup: Setup,
    moves: {},
    phases: {
        initTiles: {
            moves: {PlaceTile},
            turn: {
                minMoves: 5,
                maxMoves: 5,
            },
            next: 'initShips',
            start: true,
        },
        initShips: {
            moves: {PlaceShipInit: PlaceInitShip},
            turn: {
                order: TurnOrder.ONCE,
            },
            next: 'production',
        },
        production: {
            onBegin: PerformProduction,
            moves: {DistributeEnergy},
            turn: {
                order: TurnOrder.ONCE,
                endIf: (G, ctx) => (G.players[ctx.currentPlayer].unspentEnergy === 0),
            },
            next: 'planning',
        },
        planning: {
            // TODO set all players active at the same time
            moves: {PlanCard, FinishPlanning},
            turn: {
                order: TurnOrder.ONCE,
                endIf: (G, ctx) => (G.players[ctx.currentPlayer].finishedPlanning),
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
                // TODO only let the starting player place
                minMoves: 3,
                maxMoves: 3,
            },
            next: 'production',
        },
    },
    ai: EntropyRallyAi,
}
