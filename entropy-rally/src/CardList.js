import React from "react";

function Card({ctx, G, card, hidden, ships, assignShipAction}) {
    let flavorText = '';
    switch (card.action) {
        case 'MOVE':
            flavorText = 'Move ' + card.actionArg + ' tiles';
            break;
        case 'TURN':
            if (card.actionArg < 180) {
                flavorText = 'Rotate left ' + card.actionArg + '°';
            } else {
                flavorText = 'Rotate right ' + (360 - card.actionArg) + '°';
            }
            break;
        case 'SHOOT':
            if (card.actionArg === 1) {
                flavorText = 'Shoot laser';
            } else if (card.actionArg === 2) {
                flavorText = 'Trigger gravitational wave';
            }
            break;
        case 'PORTAL':
            flavorText = 'Ship titanium';
            break;
        case 'SHIP':
            flavorText = 'Build new ship';
            break;
        case 'TIDY':
            flavorText = 'Tidy up space';
            break;
        default:
            console.log('Unknown card action', card.action);
    }

    const buttons = ships ? ships.map((ship) => <button key={ship.id}
                                                        onClick={() => assignShipAction(ship.id, card.id)}>S{ship.id}</button>) : []

    if (hidden) {
        return (
            <div className="card card-hidden"/>
        )
    }

    return (
        <div className="card">
            <div className="card-header">
                <div>{card.energy}</div>
                <div>{card.entropy !== 0 ? card.entropy : ''}</div>
            </div>
            {flavorText}
            {buttons.length > 0 && <div className="card-ship-buttons">{buttons}</div>}
        </div>
    )
}

export function CardList({ctx, G, cards, hidden, ships, assignShipAction}) {
    return (
        <div className="card-list">
            {cards.map(card => <Card key={card.id} ctx={ctx} G={G} card={card} hidden={hidden} ships={ships}
                                     assignShipAction={assignShipAction}/>)}
        </div>
    );
}
