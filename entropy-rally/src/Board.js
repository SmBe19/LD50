import React from 'react';
import {TileBoard} from "./TileBoard";
import './Game.css';

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

function ProductionBoard({ctx, G, moves, myTurn}) {
    return (
        <div>Production</div>
    )
}

function PlanningBoard({ctx, G, moves, myTurn}) {
    return (
        <div>Planning</div>
    )
}

function ChaosBoard({ctx, G, moves, myTurn}) {
    return (
        <div>Chaos</div>
    )
}

function ExpansionBoard({ctx, G, moves, myTurn}) {
    return (
        <div>Expansion</div>
    )
}

export function EntropyRallyBoard({ctx, G, moves, playerID}) {
    let myTurn = ctx.currentPlayer === playerID;
    let winner = '';
    if (ctx.gameover) {
        winner = <div id="winner">Winner: {ctx.gameover.winner}</div>;
    }

    return (
        <div>
            <div><h1>Entropy Rally</h1></div>
            {winner}
            <div>Entropy: {G.entropy}</div>
            {ctx.phase === 'initTiles' && <InitTilesBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'initShips' && <InitShipsBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'production' && <ProductionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'planning' && <PlanningBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'chaos' && <ChaosBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
            {ctx.phase === 'expansion' && <ExpansionBoard ctx={ctx} G={G} moves={moves} myTurn={myTurn}/>}
        </div>
    );
}