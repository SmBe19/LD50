function Tile(name, titanium, energy, energyProduction, entropyThreshold, entropyChange) {
    return {
        name,
        titanium,
        energy,
        energyProduction,
        entropyThreshold,
        entropyChange,
    }
}

export const START_TILE = Tile('Start', 0, 0, 0, 0, 0);
const SPACE = Tile('Space', 0, 0, 0, 0, 0);
const TITANIUM = (amount) => Tile('Titanium', amount, 0, 0, 0, 0);
const ENERGY = (amount) => Tile('Energy', 0, amount, 0, 0, 0);
const PORTAL = (amount, threshold) => Tile('EnergyPortal', 0, 0, amount, threshold, 0);
const ORGANIZED = (amount) => Tile('NeatlyOrganizedSpace', 0, 0, 0, 0, amount);

// TODO balance tile distribution
export function GetTilePile() {
    let res = [];
    for(let i = 0; i < 50; i++) {
        res.push(SPACE);
    }
    for(let i = 0; i < 10; i++) {
        res.push(TITANIUM(2));
    }
    for(let i = 0; i < 10; i++) {
        res.push(TITANIUM(3));
    }
    for(let i = 0; i < 10; i++) {
        res.push(TITANIUM(4));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ENERGY(5));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ENERGY(20));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(3, 0));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(5, 0));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(7, -100));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(10, -200));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(15, -300));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(20, -400));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(25, -500));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ORGANIZED(-10));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ORGANIZED(-50));
    }
    for(let i = 0; i < 2; i++) {
        res.push(ORGANIZED(-200));
    }
    return res;
}