import {GetBorderTiles} from "./Game";

export const EntropyRallyAi = {
    enumerate: (G, ctx) => {
        switch(ctx.phase) {
            case 'initTiles':
                return GetBorderTiles(G).map(tile => ({
                    move: 'PlaceTile',
                    args: [tile.x, tile.y],
                }));
            default:
                return [];
        }
    }
}
