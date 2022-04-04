import React from "react";

function isCardTooExpensive(ship, card) {
    const available = ship.energy - ship.plannedCards.map(card => card.energy).reduce((a, b) => a+b, 0);
    return card.energy > available;
}

export function Card({ctx, G, card, hidden, cssExtension, ships, assignShipAction}) {
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
        <button key={ship.id} onClick={() => assignShipAction(ship.id, card.id)} className={isCardTooExpensive(ship, card) ? 'card-too-expensive' : ''}>S{ship.id}</button>) : []

    if (hidden) {
        return (
            <div className="card card-hidden"/>
        )
    }

    return (
        <div className={'card' + (cssExtension ? ' card-' + cssExtension : '')}>
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
    const sortedCards = cards.slice();
    sortedCards.sort((a, b) => a.sortArg - b.sortArg);
    return (
        <div className="card-list">
            {sortedCards.map(card => <Card key={card.id} ctx={ctx} G={G} card={card} hidden={hidden} ships={ships}
                                           assignShipAction={assignShipAction}/>)}
        </div>
    );
}
