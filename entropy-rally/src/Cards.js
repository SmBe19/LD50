import {multiplyArrayAndAddIds} from "./Tiles";

function Card(energy, entropy, action, actionArg, sortArg) {
    return {
        id: -1,
        energy,
        entropy,
        action,
        actionArg,
        sortArg,
    }
}

const MOVE_1 = Card(5, 0, 'MOVE', 1, 1);
const MOVE_2 = Card(15, 0, 'MOVE', 2, 2);
const MOVE_3 = Card(25, 0, 'MOVE', 3, 3);
const TURN_1 = Card(5, 0, 'TURN', 60, 4);
const TURN_2 = Card(15, 0, 'TURN', 120, 5);
const TURN_3 = Card(25, 0, 'TURN', 180, 6);
const TURN_4 = Card(15, 0, 'TURN', 240, 7);
const TURN_5 = Card(5, 0, 'TURN', 300, 8);
const LASER = Card(30, 0, 'SHOOT', 1, 13);
const GRAVITY = Card(50, 0, 'SHOOT', 2, 14);
const PORTAL = Card(400, 0, 'PORTAL', 0, 12);
const SHIP = Card(99, 0, 'SHIP', 0, 11);
const TIDY = Card(20, -50, 'TIDY', 0, 9);
const CHAOS = Card(10, 50, 'TIDY', 0, 10);

// TODO balance card distribution
export function GetCardPile() {
    let actions = [];
    let movement = [];
    for(let i = 0; i < 80; i++) {
        movement.push(MOVE_1);
    }
    for(let i = 0; i < 20; i++) {
        movement.push(MOVE_2);
    }
    for(let i = 0; i < 10; i++) {
        movement.push(MOVE_3);
    }
    for(let i = 0; i < 20; i++) {
        movement.push(TURN_1, TURN_5);
    }
    for(let i = 0; i < 7; i++) {
        movement.push(TURN_2, TURN_3, TURN_4);
    }
    for(let i = 0; i < 10; i++) {
        movement.push(LASER);
    }
    for(let i = 0; i < 10; i++) {
        movement.push(GRAVITY);
    }
    for(let i = 0; i < 30; i++) {
        actions.push(LASER);
    }
    for(let i = 0; i < 30; i++) {
        actions.push(GRAVITY);
    }
    for(let i = 0; i < 20; i++) {
        actions.push(PORTAL);
    }
    for(let i = 0; i < 20; i++) {
        actions.push(SHIP);
    }
    for(let i = 0; i < 30; i++) {
        actions.push(TIDY);
    }
    for(let i = 0; i < 30; i++) {
        actions.push(CHAOS);
    }
    actions = multiplyArrayAndAddIds(actions, 3, 0);
    movement = multiplyArrayAndAddIds(movement, 3, actions.length);
    return [movement, actions];
}