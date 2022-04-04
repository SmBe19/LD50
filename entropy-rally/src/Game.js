import {INVALID_MOVE, TurnOrder} from "boardgame.io/core";
import {EntropyRallyAi} from "./Ai";
import {GetCardPile} from "./Cards";
import {GetTilePile, START_TILE} from "./Tiles";

function Setup(ctx) {
    const [movement, actions] = GetCardPile();
    return {
        entropy: -1000,
        tilePile: ctx.random.Shuffle(GetTilePile()),
        cardPileActions: ctx.random.Shuffle(actions),
        cardPileMovement: ctx.random.Shuffle(movement),
        startingPlayer: 0,
        lastShipId: 0,
        lastLaserId: 0,
        players: Array(ctx.numPlayers).fill({
            score: 0,
            cards: [],
            unspentEnergy: 0,
            finishedPlanning: false,
            placingShip: false,
            placingShipFrom: null,
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

function CreateLaser(G, x, y, dx, dy, rotation, type) {
    G.lastLaserId++;
    return {
        id: G.lastLaserId,
        x,
        y,
        dx,
        dy,
        rotation,
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

function SkipFinishedShipActionsPlayers(G, ctx, idx, isFirst) {
    if (!isFirst && idx === G.startingPlayer) {
        return;
    }
    if (!AllShipsForPlayerFinished(G, ctx, idx)) {
        return idx;
    }
    let currIdx = idx;
    do {
        currIdx = (currIdx + 1) % ctx.numPlayers;
    } while (currIdx !== idx && AllShipsForPlayerFinished(G, ctx, currIdx))
    if (currIdx !== idx && currIdx !== G.startingPlayer) {
        return currIdx;
    }
    if (isFirst) {
        return idx;
    }
}

const SHIP_ACTIONS_SP = {
    first: (G, ctx) => SkipFinishedShipActionsPlayers(G, ctx, G.startingPlayer, true),
    next: (G, ctx) => SkipFinishedShipActionsPlayers(G, ctx, (ctx.playOrderPos + 1) % ctx.numPlayers, false),
}

function AdjustEntropy(G, ctx, change) {
    if (G.entropy === 0 || change === 0) {
        return;
    }
    G.entropy = Math.min(0, G.entropy + change);
}

function PlaceTile(G, ctx, x, y) {
    if (GetBorderTiles(G).filter(tile => tile.x === x && tile.y === y).length === 0) {
        return INVALID_MOVE;
    }
    const tile = G.tilePile.pop();
    G.tiles.push(CreateTile(tile, x, y));
    AdjustEntropy(G, ctx, tile.entropyChange);
    tile.entropyChange = 0;
}

function PlaceInitShip(G, ctx, x, y, rotation) {
    const blockedTiles = G.players.flatMap(player => player.ships).flatMap(ship => [ship, ...GetNeighbors(ship)]);
    if (blockedTiles.filter(tile => tile.x === x && tile.y === y).length > 0) {
        return INVALID_MOVE;
    }
    G.players[ctx.playOrderPos].ships.push(CreateShip(G, ctx.playOrderPos, x, y, rotation));
    ResolveMovementActions(G, ctx, x, y);
}

function PerformProduction(G, ctx) {
    for (const tile of G.tiles) {
        if (tile.owner !== null && tile.tile.energyProduction > 0 && tile.tile.entropyThreshold >= G.entropy) {
            G.players[tile.owner].unspentEnergy += tile.tile.energyProduction;
            AdjustEntropy(G, ctx, tile.tile.energyProduction);
        }
    }
    for (let i = 0; i < ctx.numPlayers; i++) {
        for (let j = 0; j < 5 * G.players[i].ships.length; j++) {
            G.players[i].cards.push(G.cardPileMovement.pop());
        }
        for (let j = 0; j < 2; j++) {
            G.players[i].cards.push(G.cardPileActions.pop());
        }
        G.players[i].unspentEnergy += 50;
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

export function GetNeighbors(tile) {
    return [
        {x: tile.x - 1, y: tile.y},
        {x: tile.x + 1, y: tile.y},
        {x: tile.x, y: tile.y + 1},
        {x: tile.x + 1, y: tile.y + 1},
        {x: tile.x - 1, y: tile.y - 1},
        {x: tile.x, y: tile.y - 1},
    ];
}

export function GetBorderTiles(G) {
    const tileKey = (tile) => tile.x * 100000 + tile.y;
    const existingTiles = new Set(G.tiles.map(tile => tileKey(tile)));
    const borderTiles = G.tiles.flatMap(tile => GetNeighbors(tile));
    const res = [];
    for (const tile of borderTiles) {
        if (!existingTiles.has(tileKey(tile))) {
            res.push(tile);
            existingTiles.add(tileKey(tile));
        }
    }
    return res;
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

function FixGameMove(G, ctx) {
    if (!AllShipsForPlayerFinished(G, ctx, ctx.playOrderPos) && !AllShipsForPlayerPlayed(G, ctx, ctx.playOrderPos)) {
        return INVALID_MOVE;
    }
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

function RevivePlayer(G, ctx, playerIdx) {
    G.tiles.forEach(tile => {
        if (tile.owner === playerIdx) {
            tile.owner = null;
        }
    });
    G.players[playerIdx].cards = [];
    const locations = [{x: 0, y: 0}, ...GetNeighbors({x: 0, y: 0})];
    for (const location of locations) {
        if (G.players.flatMap(player => player.ships).filter(ship => ship.x === location.x && ship.y === location.y).length === 0) {
            let newShip = CreateShip(G, playerIdx, location.x, location.y, 0);
            newShip.plannedCards.push()
            G.players[playerIdx].ships.push(newShip);
            break;
        }
    }
}

function ResolveMovementActions(G, ctx, x, y) {
    const ships = G.players.flatMap(player => player.ships).filter(ship => ship.x === x && ship.y === y);
    const lasers = G.lasers.filter(laser => laser.x === x && laser.y === y);
    const tiles = G.tiles.filter(tile => tile.x === x && tile.y === y);
    const locationsToUpdate = [];
    for (const laser of lasers) {
        if (laser.type === 1) {
            for (const ship of ships) {
                ship.energy -= 20;
            }
        } else if (laser.type === 2) {
            for (const ship of ships) {
                ship.x += laser.dx;
                ship.y += laser.dy;
                if (locationsToUpdate.filter(tile => tile.x === ship.x && tile.y === ship.y).length === 0) {
                    locationsToUpdate.push({x: ship.x, y: ship.y});
                }
            }
        }
    }
    // TODO implement resource transfer if multiple ships of same player are present
    if (ships.length > 1) {
        const energyLoss = Array(ctx.numPlayers).fill(0);
        for (let i = 0; i < ctx.numPlayers; i++) {
            energyLoss[i] = ships.filter(ship => ship.player !== i).map(ship => ship.energy).reduce((a, b) => a + b, 0);
        }
        for (let i = 0; i < ctx.numPlayers; i++) {
            const otherEnergy = energyLoss[i];
            if (otherEnergy > 0) {
                for (const ship of ships.filter(ship => ship.player === i)) {
                    ship.energy -= otherEnergy;
                }
            }
        }
    }
    if (ships.length > 0 || tiles.length === 0) {
        G.lasers = G.lasers.filter(laser => laser.x !== x || laser.y !== y);
    }
    if (ships.length > 0 && tiles.length === 0) {
        for (const player of G.players) {
            player.ships = player.ships.filter(ship => ship.x !== x || ship.y !== y);
        }
    }
    for (const player of G.players) {
        player.ships = player.ships.filter(ship => ship.energy >= 0);
    }
    const aliveShips = ships.filter(ship => ship.energy >= 0);
    if (tiles.length > 0 && aliveShips.length > 0) {
        for (const tileWrapper of tiles) {
            const tile = tileWrapper.tile;
            if (tile.titanium > 0) {
                aliveShips[0].titanium += tile.titanium;
                tile.titanium = 0;
            }
            if (tile.energy > 0) {
                aliveShips[0].energy += tile.energy;
                tile.energy = 0;
            }
            if (tile.energyProduction > 0) {
                tileWrapper.owner = aliveShips[0].player;
            }
        }
    }
    if (ctx.phase !== 'initShips' && ctx.phase !== 'initTiles') {
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (G.players[i].ships.length === 0) {
                RevivePlayer(G, ctx, i);
            }
        }
    }
    for (const location of locationsToUpdate) {
        ResolveMovementActions(G, ctx, location.x, location.y);
    }
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
            const newLaser = CreateLaser(G, ship.x + shootDelta.dx, ship.y + shootDelta.dy, shootDelta.dx, shootDelta.dy, ship.rotation, card.actionArg);
            G.lasers.push(newLaser);
            ResolveMovementActions(G, ctx, newLaser.x, newLaser.y);
            break;
        case 'PORTAL':
            G.players[ctx.playOrderPos].score += ship.titanium;
            ship.titanium = 0;
            break;
        case 'SHIP':
            G.players[ctx.playOrderPos].placingShip = true;
            G.players[ctx.playOrderPos].placingShipFrom = ship.id;
            break;
        case 'TIDY':
            break;
        default:
            console.log('Unknown card action', card.action);
    }
}

function PlayCard(G, ctx, shipID) {
    if (G.players[ctx.playOrderPos].placingShip) {
        return INVALID_MOVE;
    }
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

function PlaceShip(G, ctx, shipID, x, y, rotation) {
    if (!G.players[ctx.playOrderPos].placingShip) {
        return INVALID_MOVE;
    }
    const ship = GetShipByID(G, ctx, shipID);
    if (!ship || GetNeighbors(ship).filter(tile => tile.x === x && tile.y === y).length === 0) {
        return INVALID_MOVE;
    }
    if (G.players.flatMap(player => player.ships).filter(ship => ship.x === x && ship.y === y).length > 0) {
        return INVALID_MOVE;
    }
    G.players[ctx.playOrderPos].ships.push(CreateShip(G, ctx.playOrderPos, x, y, rotation));
    G.players[ctx.playOrderPos].placingShip = false;
    ResolveMovementActions(G, ctx, x, y);
}

function ResetPlayedThisTurn(G, ctx) {
    for (const ship of G.players.flatMap(player => player.ships)) {
        ship.playedThisTurn = false;
    }
}

function AllShipsForPlayerPlayed(G, ctx, idx) {
    const player = G.players[idx === undefined ? ctx.playOrderPos : idx];
    if (player.placingShip) {
        return false;
    }
    for (const ship of player.ships) {
        if (!ship.playedThisTurn && ship.plannedCards.length > 0) {
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
    if (G.entropy === 0 || G.players.filter(player => player.ships.length > 0).length === 0) {
        let winner = 0;
        let winners = [0];
        for (let i = 1; i < ctx.numPlayers; i++) {
            if (G.players[i].score > G.players[winner].score) {
                winner = i;
                winners = [i];
            } else if (G.players[i].score === G.players[winner].score) {
                winners.push(i);
            }
        }
        ctx.events.endGame({winners});
    }
}

function NextStartingPlayer(G, ctx) {
    G.startingPlayer = (G.startingPlayer + 1) % ctx.numPlayers;
}

export const EntropyRally = {
    name: 'entropy-rally',
    setup: Setup,
    moves: {},
    phases: {
        initTiles: {
            moves: {PlaceTile},
            turn: {
                minMoves: 1,
                maxMoves: 1,
            },
            endIf: (G, ctx) => (G.tiles.length === 1 + 5 * ctx.numPlayers),
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
            moves: {DistributeEnergy, FixGameMove},
            turn: {
                order: ONCE_SP,
                endIf: (G, ctx) => (G.players[ctx.playOrderPos].unspentEnergy === 0 || G.players[ctx.playOrderPos].ships.length === 0),
            },
            next: 'planning',
        },
        planning: {
            moves: {PlanCard, FinishPlanning},
            turn: {
                order: ONCE_SP,
                endIf: (G, ctx) => (G.players[ctx.playOrderPos].finishedPlanning),
            },
            next: (G, ctx) => (G.players.flatMap(player => player.ships).filter(ship => ship.plannedCards.length > 0).length > 0 ? 'chaos' : 'expansion'),
        },
        chaos: {
            onBegin: (G, ctx) => {
                MoveLasers(G, ctx);
                ResetPlayedThisTurn(G, ctx);
            },
            moves: {PlayCard, PlaceShip, FixGameMove},
            turn: {
                order: SHIP_ACTIONS_SP,
                endIf: AllShipsForPlayerPlayed,
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
    minPlayers: 2,
    maxPlayers: 4,
}
