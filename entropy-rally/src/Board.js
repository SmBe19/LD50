import React, {Fragment, useState} from 'react';
import {Ship, Tile, TileBoard} from "./TileBoard";
import './GameColors.css';
import './Game.css';
import {ShipBoard} from "./ShipBoard";
import {CardList} from "./CardList";

function InitTilesBoard({ctx, G, moves, myTurn}) {
    const onClick = (x, y) => moves.PlaceTile(x, y);
    const nextTile = G.tilePile[G.tilePile.length - 1];

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableBorder={myTurn} onClick={onClick}/>
            <div className="tile-preview">
                <div className="tile-preview-title">Next Tile</div>
                <div className="tile-board-inner">
                    <Tile x={0} y={0} tile={nextTile}/>
                </div>
            </div>
        </Fragment>
    )
}

function ShipPreview({ctx, G, rotation, setRotation}) {
    const previewShip = {
        player: ctx.playOrderPos,
        id: G.lastShipId + 1,
        x: 0,
        y: 0,
        rotation,
    }
    return (
        <div className="ship-preview">
            <div className="tile-board-inner">
                <Ship ship={previewShip}/>
            </div>
            <button className="ship-preview-rotate ship-preview-rotate-0" onClick={() => setRotation(0)}>0°</button>
            <button className="ship-preview-rotate ship-preview-rotate-60" onClick={() => setRotation(60)}>60°</button>
            <button className="ship-preview-rotate ship-preview-rotate-120" onClick={() => setRotation(120)}>120°</button>
            <button className="ship-preview-rotate ship-preview-rotate-180" onClick={() => setRotation(180)}>180°</button>
            <button className="ship-preview-rotate ship-preview-rotate-240" onClick={() => setRotation(240)}>240°</button>
            <button className="ship-preview-rotate ship-preview-rotate-300" onClick={() => setRotation(300)}>300°</button>
        </div>
    )
}

function InitShipsBoard({ctx, G, moves, myTurn}) {
    const [rotation, setRotation] = useState(0);
    const onClick = (x, y) => moves.PlaceInitShip(x, y, rotation);

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableTiles={myTurn} onClick={onClick}/>
            {myTurn && <ShipPreview ctx={ctx} G={G} rotation={rotation} setRotation={setRotation}/>}
        </Fragment>
    )
}

function ProductionBoard({ctx, G, moves, myTurn, playerID}) {
    const distributeEnergyAction = (shipID, amount) => moves.DistributeEnergy(shipID, amount);
    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={myTurn} cardsVisible={true}
                   maxEnergy={G.players[ctx.playOrderPos].unspentEnergy} submitEnergyAction={distributeEnergyAction}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G}/>
            <CardList ctx={ctx} G={G} cards={G.players[playerID].cards}/>
            <div className="board-ships">
                {myShipBoards}
                {otherShipBoards}
            </div>
        </Fragment>
    )
}

function PlanningBoard({ctx, G, moves, myTurn, playerID}) {
    const planCardAction = (shipID, cardID) => moves.PlanCard(shipID, cardID);

    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={true}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <div>
            <TileBoard ctx={ctx} G={G}/>
            {myTurn && <button onClick={() => moves.FinishPlanning()}>Finish Planning</button>}
            <CardList ctx={ctx} G={G} cards={G.players[playerID].cards}
                      ships={myTurn ? G.players[playerID].ships : undefined} assignShipAction={planCardAction}/>
            {myShipBoards}
            {otherShipBoards}
        </div>
    )
}

// TODO implement ship placement
function ChaosBoard({ctx, G, moves, myTurn, playerID}) {
    const playCardAction = (shipID) => moves.PlayCard(shipID);

    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={myTurn && !ship.playedThisTurn} cardsVisible={true}
                   playCardAction={playCardAction}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <div>
            <TileBoard ctx={ctx} G={G}/>
            {myShipBoards}
            {otherShipBoards}
        </div>
    )
}

function ExpansionBoard({ctx, G, moves, myTurn}) {
    const onClick = (x, y) => moves.PlaceTile(x, y);

    return (
        <div>
            <div>Current Tile: {G.tilePile[G.tilePile.length - 1].name}</div>
            <TileBoard ctx={ctx} G={G} clickableBorder={myTurn} onClick={onClick}/>
        </div>
    )
}

function ScoreBoard({ctx, G}) {
    const scoreBoard = G.players.map((player, idx) =>
        <tr key={idx} className={'player-' + idx}>
            <td className="board-scores-starting-player">{G.startingPlayer === idx &&
                <span title="starting player">★</span>}</td>
            <td>Player {idx + 1}</td>
            {ctx.phase === 'production' && <td className="board-scores-energy">{player.unspentEnergy}↯</td>}
            <td className="board-scores-score">{player.score}★</td>
        </tr>)

    return (
        <div className="board-scores">
            <table>
                <tbody>
                {scoreBoard}
                </tbody>
            </table>
        </div>
    )
}

function calculateHexagonParameters(side) {
    return (<div>
        <div>Rect: {Math.sqrt(3) * side}px/{side}px</div>
        <div>Triangle: {side / 2}px</div>
    </div>)
}

export function EntropyRallyBoard({ctx, G, moves, playerID}) {
    const myTurn = ctx.currentPlayer === playerID;
    const playOrderPos = ctx.playOrder.indexOf(playerID);
    let winner = '';
    if (ctx.gameover) {
        winner = (<div className="board-winner">Winner: Player {ctx.gameover.winner}</div>);
    }

    return (
        <div className="board-root">
            {ctx.phase === 'initTiles' && <InitTilesBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'initShips' && <InitShipsBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'production' &&
                <ProductionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos}/>}
            {ctx.phase === 'planning' &&
                <PlanningBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos}/>}
            {ctx.phase === 'chaos' &&
                <ChaosBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos}/>}
            {ctx.phase === 'expansion' && <ExpansionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}

            <div className="board-gameinfo">
                <div className="board-gamename">Entropy Rally</div>
                <div className="board-playername">Player {playOrderPos + 1}</div>
            </div>
            <div className="board-entropy">
                {G.entropy} ✦
            </div>
            <ScoreBoard ctx={ctx} G={G}/>
            {winner}
        </div>
    );
}