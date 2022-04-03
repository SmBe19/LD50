import React from "react";

function Tile({x, y, owner, tile, onClick}) {
    let cssClass = 'tile-' + (tile || {name: 'border'}).name
    let onClickHandler;
    if (onClick) {
        cssClass += ' clickable';
        onClickHandler = () => onClick(x, y);
    }
    const coords = getHexagonCenterScreenCoords(x, y);
    const yoff = coords.y - 60;
    const xoff = coords.x - 52;
    return (<div style={{position: 'absolute', left: xoff + 'px', top: yoff + 'px'}}>
            <div className={'tile-top ' + cssClass}/>
            <div className={'tile-middle ' + cssClass} onClick={onClickHandler}>
                {owner !== null && <div className={'tile-owner player-' + owner}/>}
            </div>
            <div className={'tile-bottom ' + cssClass}/>
        </div>
    )
}

function Ship({ship}) {
    let cssClass = 'player-' + ship.player
    const coords = getHexagonCenterScreenCoords(ship.x, ship.y);
    const xoff = coords.x - 15;
    const yoff = coords.y - 10;
    return (<div style={{position: 'absolute', left: xoff + 'px', top: yoff + 'px'}}>
        <div className="ship-wrapper" style={{transform: 'rotate(' + -ship.rotation + 'deg)'}}>
            <div className={cssClass + ' ship-middle'}>
                S{ship.id}
            </div>
            <div className={cssClass + ' ship-front'}/>
        </div>
    </div>)
}

export function getHexagonCenterScreenCoords(x, y) {
    return {
        x: x * 104 - y * 52,
        y: y * 90
    }
}

export function getNeighbors(tile) {
    return [
        {x: tile.x - 1, y: tile.y},
        {x: tile.x + 1, y: tile.y},
        {x: tile.x, y: tile.y + 1},
        {x: tile.x + 1, y: tile.y + 1},
        {x: tile.x - 1, y: tile.y - 1},
        {x: tile.x, y: tile.y - 1},
    ];
}

export function getBorderTiles(G) {
    const tileKey = (tile) => tile.x * 100000 + tile.y;
    const existingTiles = new Set(G.tiles.map(tile => tileKey(tile)));
    const borderTiles = G.tiles.flatMap(tile => getNeighbors(tile));
    const res = [];
    for (const tile of borderTiles) {
        if (!existingTiles.has(tileKey(tile))) {
            res.push(tile);
            existingTiles.add(tileKey(tile));
        }
    }
    return res;
}

export function TileBoard({ctx, G, onClick, clickableTiles, clickableBorder}) {

    const borderTileKey = (tile) => 'b' + (tile.x * 100000 + tile.y);

    let tiles = G.tiles.map(tile =>
        clickableTiles ?
            <Tile key={tile.tile.id} x={tile.x} y={tile.y} owner={tile.owner} tile={tile.tile} onClick={onClick}/> :
            <Tile key={tile.tile.id} x={tile.x} y={tile.y} owner={tile.owner} tile={tile.tile}/>
    );
    if (clickableBorder === true) {
        tiles.push(...getBorderTiles(G).map(tile =>
            <Tile key={borderTileKey(tile)} x={tile.x} y={tile.y} onClick={onClick}/>));
    }
    let ships = G.players.flatMap(player => player.ships).map(ship =>
        <Ship key={ship.id} ship={ship}/>)

    // TODO make scaling controls
    // TODO make translation controls
    return (
        <div className="tile-board-outer">
            <div className="tile-board-scaling" style={{transform: 'scale(1)'}}>
                <div className="tile-board-inner">
                    {tiles}
                    {ships}
                </div>
            </div>
        </div>
    );
}