import React, {useState} from "react";
import {Card, CardList} from "./CardList";

export function ShipBoard({ctx, G, ship, active, cardsVisible, maxEnergy, submitEnergyAction, playCardAction}) {
    const [addEnergy, setAddEnergy] = useState(0);

    const submitEnergy = () => {
        submitEnergyAction(ship.id, addEnergy);
        setAddEnergy(0);
    };
    const cards = [];
    cards.push(...ship.playedCards.map(card =>
        <Card key={card.id} ctx={ctx} G={G} card={card} hidden={false} cssExtension="played"/>));
    cards.push(...ship.plannedCards.map(card =>
        <Card key={card.id} ctx={ctx} G={G} card={card} hidden={!cardsVisible}/>));
    cards.push(...ship.discardedCards.map(card =>
        <Card key={card.id} ctx={ctx} G={G} card={card} hidden={false} cssExtension="discarded"/>));

    const largeBoard = ctx.phase === 'planning' || ctx.phase === 'chaos';

    return (
        <div className={'ship-board' + (largeBoard ? ' ship-board-large' : '')} style={{position: 'relative'}}>
            <div className={'ship-board-header player-' + ship.player}>
                <div>Ship S{ship.id}</div>
                {active && playCardAction && <div>
                    <button onClick={() => playCardAction(ship.id)}>Play</button>
                </div>}
            </div>
            <div className='ship-board-resources'>
                <div>
                    {ship.energy}↯
                </div>
                {(active && maxEnergy > 0) ?
                    <div>+<input className="ship-board-energy-input" type="number" value={addEnergy}
                                 onChange={(ev) => setAddEnergy(parseInt(ev.target.value))} min={0} max={maxEnergy}/>
                        <button onClick={submitEnergy}>Add</button>
                    </div>
                    : <div>{ship.titanium}★</div>}
            </div>

            <div className="ship-board-cards">
                {cards}
            </div>
        </div>
    );
}