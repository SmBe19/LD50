import React from "react";

function Tile({x, y, tile, onClick, offset}) {
    let cssClass = 'tile-' + (tile || {name: 'border'}).name
    if (onClick) {
        cssClass += ' clickable';
    }
    const yoff = offset.y + y * 90;
    const xoff = offset.x + x * 104 - y * 52;
    return (<div style={{position: 'absolute', left: xoff + 'px', top: yoff + 'px'}}>
            <div className={'tile-top ' + cssClass}/>
            <div className={'tile-middle ' + cssClass} onClick={() => onClick(x, y)}>
                Tile at {x}/{y}.
            </div>
            <div className={'tile-bottom ' + cssClass}/>
        </div>
    )
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

    const tileKey = (tile) => tile.x * 100000 + tile.y;
    // TODO calculate offset somehow
    const offset = {x: 200, y: 200};

    let tiles = G.tiles.map(tile =>
        clickableTiles ?
            <Tile key={tileKey(tile)} x={tile.x} y={tile.y} tile={tile.tile} onClick={onClick} offset={offset}/> :
            <Tile key={tileKey(tile)} x={tile.x} y={tile.y} tile={tile.tile} offset={offset}/>
    );
    if (clickableBorder === true) {
        tiles.push(...getBorderTiles(G).map(tile =>
            <Tile key={tileKey(tile)} x={tile.x} y={tile.y} onClick={onClick} offset={offset}/>));
    }

    return (
        <div style={{position: 'relative', width: '500px', height: '500px'}}>
            {tiles}
        </div>
    );
}