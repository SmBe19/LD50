import {ActivePlayers, INVALID_MOVE, Stage, TurnOrder} from "boardgame.io/core";
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
        tiles: [CreateTile(START_TILE, 0, 0)],
        lasers: [],
    };
}

function CreateTile(tile, x, y) {
    return {
        tile,
        x,
        y,
        owner: null,
    }
}

function CreateShip(G, player, x, y, rotation) {
    G.lastShipId++;
    return {
        id: G.lastShipId,
        player,
        x,
        y,
        rotation,
        energy: 0,
        titanium: 0,
        plannedCards: [],
        playedCards: [],
        discardedCards: [],
        playedThisTurn: false,
    }
}

function CreateLaser(x, y, dx, dy, type) {
    return {
        x,
        y,
        dx,
        dy,
        type,
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

function SkipFinishedShipActionsPlayers(G, ctx, idx) {
    if (!AllShipsForPlayerFinished(G, ctx, idx)) {
        return idx;
    }
    let currIdx = idx;
    do {
        currIdx = (currIdx + 1) % ctx.numPlayers;
    } while (currIdx !== idx && AllShipsForPlayerFinished(G, ctx, currIdx))
    if (currIdx !== idx) {
        return currIdx;
    }
}

const SHIP_ACTIONS_SP = {
    first: (G, ctx) => SkipFinishedShipActionsPlayers(G, ctx, G.startingPlayer),
    next: (G, ctx) => SkipFinishedShipActionsPlayers(G, ctx, (ctx.playOrderPos + 1) % ctx.numPlayers),
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
    G.tiles.push(CreateTile(tile, x, y));
    AdjustEntropy(G, ctx, tile.entropyChange);
}

function PlaceInitShip(G, ctx, x, y, rotation) {
    // TODO check that it is not adjacent/equivalent to other ship
    G.players[ctx.playOrderPos].ships.push(CreateShip(G, ctx.playOrderPos, x, y, rotation));
}

function PerformProduction(G, ctx) {
    for (const tile of G.tiles) {
        if (tile.owner !== null && tile.tile.energyProduction > 0 && tile.tile.entropyThreshold >= G.entropy) {
            G.players[tile.owner].unspentEnergy += tile.tile.energyProduction;
            AdjustEntropy(G, ctx, tile.tile.energyProduction);
        }
    }
    for (let i = 0; i < ctx.numPlayers; i++) {
        for (let j = 0; j < 3 + 2 * G.players[i].ships.length; j++) {
            G.players[i].cards.push(G.cardPile.pop());
        }
        G.players[i].unspentEnergy += 10;
        G.players[i].finishedPlanning = false;
        for (const ship of G.players[i].ships) {
            ship.playedCards = [];
            ship.discardedCards = [];
        }
    }
}

function GetShipByID(G, ctx, shipID) {
    return G.players[ctx.playOrderPos].ships.filter(ship => ship.id === shipID)[0];
}

function DistributeEnergy(G, ctx, shipID, amount) {
    if (G.players[ctx.playOrderPos].unspentEnergy < amount) {
        return INVALID_MOVE;
    }
    const ship = GetShipByID(G, ctx, shipID);
    if (!ship) {
        return INVALID_MOVE;
    }
    ship.energy += amount;
    G.players[ctx.playOrderPos].unspentEnergy -= amount;
}

function PlanCard(G, ctx, shipID, cardID) {
    const ship = GetShipByID(G, ctx, shipID);
    if (!ship) {
        return INVALID_MOVE;
    }
    const cardIdx = G.players[ctx.playOrderPos].cards.map(card => card.id).indexOf(cardID);
    if (cardIdx < 0 || cardIdx >= G.players[ctx.playOrderPos].cards.length) {
        return INVALID_MOVE;
    }
    ship.plannedCards.push(G.players[ctx.playOrderPos].cards[cardIdx]);
    G.players[ctx.playOrderPos].cards.splice(cardIdx, 1);
}

function FinishPlanning(G, ctx) {
    G.players[ctx.playOrderPos].finishedPlanning = true;
}

function MoveLasers(G, ctx) {
    for (const laser of G.lasers) {
        laser.x += laser.dx;
        laser.y += laser.dy;
        ResolveMovementActions(G, ctx, laser.x, laser.y);
    }
}

function GetDeltaFromRotation(rotation) {
    switch (rotation) {
        case 0:
            return {dx: 1, dy: 0}
        case 60:
            return {dx: 0, dy: -1}
        case 120:
            return {dx: -1, dy: -1}
        case 180:
            return {dx: -1, dy: 0}
        case 240:
            return {dx: 0, dy: 1}
        case 300:
            return {dx: 1, dy: 1}
        default:
            console.log('Invalid rotation', rotation)
    }
}

function ResolveMovementActions(G, ctx, x, y) {
    // TODO implement battle, laser & out of board
}

function HandleCardAction(G, ctx, ship, card) {
    switch (card.action) {
        case 'MOVE':
            const moveDelta = GetDeltaFromRotation(ship.rotation);
            ship.x += moveDelta.dx * card.actionArg;
            ship.y += moveDelta.dy * card.actionArg;
            ResolveMovementActions(G, ctx, ship.x, ship.y);
            break;
        case 'TURN':
            ship.rotation = (ship.rotation + card.actionArg) % 360;
            break;
        case 'SHOOT':
            const shootDelta = GetDeltaFromRotation(ship.rotation);
            G.lasers.push(CreateLaser(ship.x + shootDelta.dx, ship.y + shootDelta.dy, shootDelta.dx, shootDelta.dy, card.actionArg));
            ResolveMovementActions(G, ship.x + shootDelta.dx, ship.y + shootDelta.dy);
            break;
        case 'PORTAL':
            G.players[ctx.playOrderPos].score += ship.titanium;
            ship.titanium = 0;
            break;
        case 'SHIP':
            ctx.setStage({stage: 'placeShip', minMoves: 1, maxMoves: 1})
            break;
        case 'TIDY':
            break;
        default:
            console.log('Unknown card action', card.action);
    }
}

function PlayCard(G, ctx, shipID) {
    const ship = GetShipByID(G, ctx, shipID);
    if (!ship || ship.playedThisTurn || ship.plannedCards.length === 0) {
        return INVALID_MOVE;
    }
    ship.playedThisTurn = true;
    const card = ship.plannedCards.shift();
    if (ship.energy < card.energy) {
        ship.discardedCards.push(card);
        return;
    }
    ship.energy -= card.energy;
    AdjustEntropy(G, ctx, card.entropy);
    HandleCardAction(G, ctx, ship, card);
    ship.playedCards.push(card);
}

function PlaceShip(G, ctx, x, y, rotation) {
    // TODO check that it is adjacent to creating ship
    G.players[ctx.playOrderPos].ships.push(CreateShip(G, ctx.playOrderPos, x, y, rotation));
}

function ResetPlayedThisTurn(G, ctx) {
    for (const ship of G.players[ctx.playOrderPos].ships) {
        ship.playedThisTurn = false;
    }
}

function AllShipsForPlayerPlayed(G, ctx, idx) {
    for (const ship of G.players[idx === undefined ? ctx.playOrderPos : idx].ships) {
        if (!ship.playedThisTurn && ship.plannedCards.length >= 0) {
            return false;
        }
    }
    return true;
}

function AllShipsForPlayerFinished(G, ctx, playerIdx) {
    for (const ship of G.players[playerIdx].ships) {
        if (ship.plannedCards.length > 0) {
            return false;
        }
    }
    return true;
}

function AllShipsFinished(G, ctx) {
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (!AllShipsForPlayerFinished(G, ctx, i)) {
            return false;
        }
    }
    return true;
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
            moves: {PlanCard, FinishPlanning},
            turn: {
                // TODO allow all players to play
                // activePlayers: ActivePlayers.ALL,
                order: ONCE_SP,
                endIf: (G, ctx) => (G.players[ctx.playOrderPos].finishedPlanning),
            },
            next: 'chaos',
        },
        chaos: {
            onBegin: MoveLasers,
            moves: {PlayCard},
            turn: {
                order: SHIP_ACTIONS_SP,
                onBegin: ResetPlayedThisTurn,
                endIf: AllShipsForPlayerPlayed,
                stages: {
                    placeShip: {
                        moves: {PlaceShip}
                    }
                }
            },
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
