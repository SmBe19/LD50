import React, {Fragment, useState} from 'react';
import {Ship, Tile, TileBoard} from "./TileBoard";
import './GameColors.css';
import './Game.css';
import {ShipBoard} from "./ShipBoard";
import {CardList} from "./CardList";

function InitTilesBoard({ctx, G, moves, myTurn, scale, offset}) {
    const onClick = (x, y) => moves.PlaceTile(x, y);
    const nextTile = G.tilePile[G.tilePile.length - 1];

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableBorder={myTurn} onClick={onClick} scale={scale} offset={offset}/>
            <div className="tile-preview">
                <div className="tile-preview-title">Next Tile</div>
                <div className="tile-board-inner">
                    <Tile G={G} x={0} y={0} tile={nextTile}/>
                </div>
            </div>
        </Fragment>
    )
}

function ShipPreview({ctx, G, rotation, setRotation, scale, offset}) {
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
            <button className="ship-preview-rotate ship-preview-rotate-120" onClick={() => setRotation(120)}>120°
            </button>
            <button className="ship-preview-rotate ship-preview-rotate-180" onClick={() => setRotation(180)}>180°
            </button>
            <button className="ship-preview-rotate ship-preview-rotate-240" onClick={() => setRotation(240)}>240°
            </button>
            <button className="ship-preview-rotate ship-preview-rotate-300" onClick={() => setRotation(300)}>300°
            </button>
        </div>
    )
}

function InitShipsBoard({ctx, G, moves, myTurn, scale, offset}) {
    const [rotation, setRotation] = useState(0);
    const onClick = (x, y) => moves.PlaceInitShip(x, y, rotation);

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableTiles={myTurn} onClick={onClick} scale={scale} offset={offset}/>
            {myTurn && <ShipPreview ctx={ctx} G={G} rotation={rotation} setRotation={setRotation}/>}
        </Fragment>
    )
}

function ProductionBoard({ctx, G, moves, myTurn, playerID, scale, offset}) {
    const distributeEnergyAction = (shipID, amount) => moves.DistributeEnergy(shipID, amount);
    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={myTurn} cardsVisible={true}
                   maxEnergy={G.players[ctx.playOrderPos].unspentEnergy} submitEnergyAction={distributeEnergyAction}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} scale={scale} offset={offset}/>
            <CardList ctx={ctx} G={G} cards={G.players[playerID].cards}/>
            <div className="board-ships">
                {myShipBoards}
                {otherShipBoards}
            </div>
            {myTurn && G.players[ctx.playOrderPos].ships.length === 0 && <div className="board-finish-planning">
                <button onClick={() => moves.FinishDistribution()}>You don't have any ships. Click this button!</button>
            </div>}
        </Fragment>
    )
}

function PlanningBoard({ctx, G, moves, myTurn, playerID, scale, offset}) {
    const planCardAction = (shipID, cardID) => moves.PlanCard(shipID, cardID);

    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={true}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} scale={scale} offset={offset}/>
            <CardList ctx={ctx} G={G} cards={G.players[playerID].cards}
                      ships={myTurn ? G.players[playerID].ships : undefined} assignShipAction={planCardAction}/>
            <div className="board-ships">
                {myShipBoards}
                {otherShipBoards}
            </div>
            {myTurn && <div className="board-finish-planning">
                <button onClick={() => moves.FinishPlanning()}>Finish Planning</button>
            </div>}
        </Fragment>
    )
}

function ChaosBoard({ctx, G, moves, myTurn, playerID, scale, offset}) {
    const [rotation, setRotation] = useState(0);
    const playCardAction = (shipID) => moves.PlayCard(shipID);
    const placeShipAction = (x, y) => moves.PlaceShip(G.players[playerID].placingShipFrom, x, y, rotation);

    const placingShip = G.players[playerID].placingShip;
    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship}
                   active={myTurn && !ship.playedThisTurn && ship.plannedCards.length > 0 && !placingShip}
                   cardsVisible={true}
                   playCardAction={playCardAction}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx !== playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false} cardsVisible={false}/>)

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableTiles={myTurn && placingShip} onClick={placeShipAction} scale={scale}
                       offset={offset}/>
            <CardList ctx={ctx} G={G} cards={G.players[playerID].cards}/>
            <div className="board-ships">
                {myShipBoards}
                {otherShipBoards}
            </div>
            {myTurn && placingShip && <ShipPreview ctx={ctx} G={G} rotation={rotation} setRotation={setRotation}/>}
        </Fragment>
    )
}

function ExpansionBoard({ctx, G, moves, myTurn, scale, offset}) {
    const onClick = (x, y) => moves.PlaceTile(x, y);
    const nextTile = G.tilePile[G.tilePile.length - 1];

    return (
        <Fragment>
            <TileBoard ctx={ctx} G={G} clickableBorder={myTurn} onClick={onClick} scale={scale} offset={offset}/>
            <div className="tile-preview">
                <div className="tile-preview-title">Next Tile</div>
                <div className="tile-board-inner">
                    <Tile G={G} x={0} y={0} tile={nextTile}/>
                </div>
            </div>
        </Fragment>
    )
}

function ScoreBoard({ctx, G}) {
    const scoreBoard = G.players.map((player, idx) =>
        <tr key={idx} className={'player-' + idx}>
            <td className="board-scores-starting-player">{G.startingPlayer === idx &&
                <span title="starting player">♚</span>}</td>
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

function BoardControls({ctx, G, scale, setScale, offset, setOffset}) {
    return (<div className="board-controls">
        <div>
            <button disabled={scale < 0.2} onClick={() => setScale(scale * 0.75)}>-🔍</button>
            <button disabled={scale >= 1} onClick={() => setScale(Math.min(1, scale * 1.5))}>+🔍</button>
        </div>
        <div>
            <button onClick={() => setOffset({x: offset.x + 100, y: offset.y})}>←</button>
            <button onClick={() => setOffset({x: offset.x - 100, y: offset.y})}>→</button>
        </div>
        <div>
            <button onClick={() => setOffset({x: offset.x, y: offset.y + 100})}>↑</button>
            <button onClick={() => setOffset({x: offset.x, y: offset.y - 100})}>↓</button>
        </div>
    </div>);
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
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({x: 0, y: 0});
    let winner = '';
    if (ctx.gameover) {
        if (ctx.gameover.winners.length > 1) {
            winner = (<div
                className="board-winner">Winners: {ctx.gameover.winners.map(winner => 'Player ' + (winner + 1)).join(', ')}</div>);
        } else {
            winner = (<div className="board-winner">Winner: Player {ctx.gameover.winners[0]+1}</div>);
        }
    }

    return (
        <div className="board-root">
            {ctx.phase === 'initTiles' && <InitTilesBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} scale={scale} offset={offset}/>}
            {ctx.phase === 'initShips' && <InitShipsBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} scale={scale} offset={offset}/>}
            {ctx.phase === 'production' &&
                <ProductionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos} scale={scale} offset={offset}/>}
            {ctx.phase === 'planning' &&
                <PlanningBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos} scale={scale} offset={offset}/>}
            {ctx.phase === 'chaos' &&
                <ChaosBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playOrderPos} scale={scale} offset={offset}/>}
            {ctx.phase === 'expansion' && <ExpansionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} scale={scale} offset={offset}/>}
            <div className="board-gameinfo">
                <div className="board-gamename">Entropy Rally</div>
                <div className="board-playername">Player {playOrderPos + 1}</div>
            </div>
            <BoardControls ctx={ctx} G={G} scale={scale} setScale={setScale} offset={offset} setOffset={setOffset}/>
            <div className="board-entropy">
                {G.entropy} ✦
            </div>
            <ScoreBoard ctx={ctx} G={G}/>
            {winner}
        </div>
    );
}