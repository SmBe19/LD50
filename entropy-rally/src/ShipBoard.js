import React from "react";
import {getBorderTiles} from "./TileBoard";

export function ShipBoard({ctx, G, ship}) {
    return (
        <div>Ship Board for ship {ship.id}</div>
    );
}