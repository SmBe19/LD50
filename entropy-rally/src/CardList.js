import React from "react";

function Card({ctx, G, card, hidden, ships, assignShipAction}) {
    let flavorText = '';
    switch (card.action) {
        case 'MOVE':
            flavorText = card.actionArg + '↑';
            break;
        case 'TURN':
            if (card.actionArg < 180) {
                flavorText = card.actionArg + '° ↺';
            } else {
                flavorText = (360 - card.actionArg) + '° ↻';
            }
            break;
        case 'SHOOT':
            if (card.actionArg === 1) {
                flavorText = '⦿';
            } else if (card.actionArg === 2) {
                flavorText = '🌊';
            }
            break;
        case 'PORTAL':
            flavorText = '🚀';
            break;
        case 'SHIP':
            flavorText = '➤';
            break;
        case 'TIDY':
            flavorText = card.entropy + ' ✦';
            break;
        default:
            console.log('Unknown card action', card.action);
    }

    const buttons = ships ? ships.map((ship) =>
        <button key={ship.id} onClick={() => assignShipAction(ship.id, card.id)}>S{ship.id}</button>) : []

    if (hidden) {
        return (
            <div className="card card-hidden"/>
        )
    }

    return (
        <div className="card">
            <div className="card-header">
                <div>{card.entropy !== 0 && card.action !== 'TIDY' ? card.entropy + ' ✦' : ''}</div>
                <div>{card.energy}↯</div>
            </div>
            <div className="card-flavor">
                {flavorText}
            </div>
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
