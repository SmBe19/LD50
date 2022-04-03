import React, {useState} from "react";
import {CardList} from "./CardList";

export function ShipBoard({ctx, G, ship, active, cardsVisible, maxEnergy, submitEnergyAction, playCardAction}) {
    const [addEnergy, setAddEnergy] = useState(0);

    const submitEnergy = () => {
        submitEnergyAction(ship.id, addEnergy);
        setAddEnergy(0);
    };

    return (
        <div>
            <div className={'player-' + ship.player}>Ship S{ship.id}</div>
            <div>Energy: {ship.energy}{active && maxEnergy > 0 &&
                <span> +<input type="number" value={addEnergy} onChange={(ev) => setAddEnergy(parseInt(ev.target.value))} min={0} max={maxEnergy}/>
                    <button onClick={submitEnergy}>Add</button>
                </span>}</div>
            <div>Titanium: {ship.titanium}</div>
            {active && playCardAction && <div><button onClick={() => playCardAction(ship.id)}>Play next card</button></div>}
            <div>Planned</div>
            <CardList ctx={ctx} G={G} cards={ship.plannedCards} hidden={!cardsVisible} />
            <div>Played</div>
            <CardList ctx={ctx} G={G} cards={ship.playedCards} hidden={false} />
            <div>Discarded</div>
            <CardList ctx={ctx} G={G} cards={ship.discardedCards} hidden={false} />
        </div>
    );
}