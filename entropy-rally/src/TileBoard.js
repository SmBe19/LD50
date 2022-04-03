import React from "react";
import {GetBorderTiles} from "./Game";

export function Tile({G, x, y, owner, tile, onClick}) {
    let cssClass = 'tile-' + (tile || {name: 'border'}).name
    if (tile && tile.entropyThreshold < G.entropy) {
        cssClass += '-disabled'
    }
    let onClickHandler;
    if (onClick) {
        cssClass += ' clickable';
        onClickHandler = () => onClick(x, y);
    }
    const flavorList = [];
    if (tile) {
        if (tile.titanium > 0) {
            flavorList.push(tile.titanium + '★')
        }
        if (tile.energy > 0) {
            flavorList.push(tile.energy + '↯')
        }
        if (tile.energyProduction > 0) {
            flavorList.push(tile.energyProduction + '↯/era');
        }
        if (tile.entropyThreshold !== 0) {
            flavorList.push('< ' + tile.entropyThreshold + ' ✦')
        }
        if (tile.entropyChange !== 0) {
            flavorList.push(tile.entropyChange + ' ✦')
        }
    }
    const coords = getHexagonCenterScreenCoords(x, y);
    const yoff = coords.y - 60;
    const xoff = coords.x - 52;
    return (<div style={{position: 'absolute', left: xoff + 'px', top: yoff + 'px'}}>
            <div className={'tile-top ' + cssClass}/>
            <div className={'tile-middle ' + cssClass} onClick={onClickHandler}>
                {owner !== null && <div className={'tile-owner player-' + owner}/>}
                {flavorList.map((flavor, idx) => <div key={idx}>{flavor}</div>)}
            </div>
            <div className={'tile-bottom ' + cssClass}/>
        </div>
    )
}

export function Ship({ship}) {
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

export function Laser({laser}) {
    const coords = getHexagonCenterScreenCoords(laser.x, laser.y);
    const xoff = coords.x - 16;
    const yoff = coords.y - 1;
    return (<div className={'laser laser-' + laser.type}
                 style={{left: xoff + 'px', top: yoff + 'px', transform: 'rotate(' + -laser.rotation + 'deg)'}}>
        <div className="laser-tail"/>
        <div className="laser-tail"/>
        <div className="laser-tail"/>
        <div className="laser-tail"/>
        <div className="laser-main"/>
    </div>);
}

export function getHexagonCenterScreenCoords(x, y) {
    return {
        x: x * 104 - y * 52,
        y: y * 90
    }
}

export function TileBoard({ctx, G, onClick, scale, offset, clickableTiles, clickableBorder}) {

    const borderTileKey = (tile) => 'b' + (tile.x * 100000 + tile.y);

    const tiles = G.tiles.map(tile =>
        clickableTiles ?
            <Tile key={tile.tile.id} G={G} x={tile.x} y={tile.y} owner={tile.owner} tile={tile.tile} onClick={onClick}/> :
            <Tile key={tile.tile.id} G={G} x={tile.x} y={tile.y} owner={tile.owner} tile={tile.tile}/>
    );
    if (clickableBorder === true) {
        tiles.push(...GetBorderTiles(G).map(tile =>
            <Tile key={borderTileKey(tile)} G={G} x={tile.x} y={tile.y} onClick={onClick}/>));
    }
    const ships = G.players.flatMap(player => player.ships).map(ship =>
        <Ship key={ship.id} ship={ship}/>)
    const lasers = G.lasers.map(laser => <Laser key={laser.id} laser={laser}/>)
    const myOffset = offset || {x: 0, y: 0};

    return (
        <div className="tile-board-outer">
            <div className="tile-board-scaling"
                 style={{transform: 'scale(' + (scale || 1) + ') translate(' + myOffset.x + 'px, ' + myOffset.y + 'px)'}}>
                <div className="tile-board-inner">
                    {tiles}
                    {ships}
                    {lasers}
                </div>
            </div>
        </div>
    );
}