import React from 'react';

export function EntropyRallyBoard({ctx, G, moves}) {
    let winner = '';
    if (ctx.gameover) {
        winner = <div id="winner">Winner: {ctx.gameover.winner}</div>;
    }

    return (<div>
            {winner}
        </div>);
}