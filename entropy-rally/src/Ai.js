import {getBorderTiles} from "./TileBoard";

export const EntropyRallyAi = {
    enumerate: (G, ctx) => {
        if (ctx.phase === 'initTiles') {
            return getBorderTiles(G).map(tile => ({
                move: 'PlaceTile',
                args: [tile.x, tile.y],
            }));
        }
        return [];
    }
}
