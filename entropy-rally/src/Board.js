import React from 'react';
import {TileBoard} from "./TileBoard";
import './Game.css';
import {ShipBoard} from "./ShipBoard";

function InitTilesBoard({ctx, G, moves, myTurn}) {
    const onClick = (x, y) => moves.PlaceTile(x, y);

    return (
        <div>
            <div>Current Tile: {G.tilePile[G.tilePile.length - 1].name}</div>
            <TileBoard ctx={ctx} G={G} clickableBorder={myTurn} onClick={onClick}/>
        </div>
    )
}

function InitShipsBoard({ctx, G, moves, myTurn}) {
    const onClick = (x, y) => moves.PlaceInitShip(x, y);

    return (
        <div>
            <TileBoard ctx={ctx} G={G} clickableTiles={myTurn} onClick={onClick}/>
        </div>
    )
}

function ProductionBoard({ctx, G, moves, myTurn, playerID}) {
    const action = (shipID, amount) => moves.DistributeEnergy(shipID, amount);
    const playerAmounts = G.players.map((player, idx) => {
        return <div key={idx} className={'player-' + idx}>Player {idx+1}: {player.unspentEnergy}</div>
    })
    const myShipBoards = G.players[playerID].ships.map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={myTurn}/>);
    const otherShipBoards = G.players.filter((player, idx) => idx != playerID).flatMap(player => player.ships).map(ship =>
        <ShipBoard key={ship.id} ctx={ctx} G={G} ship={ship} active={false}/>)

    return (
        <div>
            {playerAmounts}
            <TileBoard ctx={ctx} G={G} action={action}/>
            {myShipBoards}
            {otherShipBoards}
        </div>
    )
}

function PlanningBoard({ctx, G, moves, myTurn, playerID}) {
    return (
        <div>Planning</div>
    )
}

function ChaosBoard({ctx, G, moves, myTurn, playerID}) {
    return (
        <div>Chaos</div>
    )
}

function ExpansionBoard({ctx, G, moves, myTurn}) {
    return (
        <div>Expansion</div>
    )
}

function calculateHexagonParameters(side) {
    return (<div>
        <div>Rect: {Math.sqrt(3) * side}px/{side}px</div>
        <div>Triangle: {side / 2}px</div>
    </div>)
}

export function EntropyRallyBoard({ctx, G, moves, playerID}) {
    let myTurn = ctx.currentPlayer === playerID;
    let winner = '';
    if (ctx.gameover) {
        winner = <div id="winner">Winner: {ctx.gameover.winner}</div>;
    }
    const playerIDInt = parseInt(playerID);

    return (
        <div>
            <div><h1>Entropy Rally</h1></div>
            <div><h2 className={'player-' + playerIDInt}>Player {playerIDInt + 1}</h2></div>
            {winner}
            <div>Entropy: {G.entropy}</div>
            {ctx.phase === 'initTiles' && <InitTilesBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'initShips' && <InitShipsBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'production' && <ProductionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playerIDInt}/>}
            {ctx.phase === 'planning' && <PlanningBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playerIDInt}/>}
            {ctx.phase === 'chaos' && <ChaosBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn} playerID={playerIDInt}/>}
            {ctx.phase === 'expansion' && <ExpansionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
        </div>
    );
}