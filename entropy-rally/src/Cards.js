function Card(energy, entropy, action, actionArg) {
    return {
        id: -1,
        energy,
        entropy,
        action,
        actionArg,
    }
}

const MOVE_1 = Card(4, 0, 'MOVE', 1);
const MOVE_2 = Card(12, 0, 'MOVE', 2);
const MOVE_3 = Card(25, 0, 'MOVE', 3);
const TURN_1 = Card(4, 0, 'TURN', 60);
const TURN_2 = Card(12, 0, 'TURN', 120);
const TURN_3 = Card(25, 0, 'TURN', 180);
const TURN_4 = Card(12, 0, 'TURN', 240);
const TURN_5 = Card(4, 0, 'TURN', 300);
const LASER = Card(30, 0, 'SHOOT', 1);
const GRAVITY = Card(50, 0, 'SHOOT', 2);
const PORTAL = Card(400, 0, 'PORTAL', 0);
const SHIP = Card(99, 0, 'SHIP', 0);
const TIDY = Card(20, -50, 'TIDY', 0);

// TODO balance card distribution
export function GetCardPile() {
    let res = [];
    for(let i = 0; i < 60; i++) {
        res.push(MOVE_1);
    }
    for(let i = 0; i < 20; i++) {
        res.push(MOVE_2);
    }
    for(let i = 0; i < 10; i++) {
        res.push(MOVE_3);
    }
    for(let i = 0; i < 30; i++) {
        res.push(TURN_1, TURN_5);
    }
    for(let i = 0; i < 10; i++) {
        res.push(TURN_2, TURN_3, TURN_4);
    }
    for(let i = 0; i < 30; i++) {
        res.push(LASER);
    }
    for(let i = 0; i < 30; i++) {
        res.push(GRAVITY);
    }
    for(let i = 0; i < 20; i++) {
        res.push(PORTAL);
    }
    for(let i = 0; i < 20; i++) {
        res.push(SHIP);
    }
    for(let i = 0; i < 30; i++) {
        res.push(TIDY);
    }
    res.push(...res);
    res.push(...res);
    res.push(...res);
    for(let i = 0; i < res.length; i++){
        res[i] = {...res[i], id: i};
    }
    return res;
}