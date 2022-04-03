function Tile(name, titanium, energy, energyProduction, entropyThreshold, entropyChange) {
    return {
        id: -1,
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
    for(let i = 0; i < 30; i++) {
        res.push(TITANIUM(2));
    }
    for(let i = 0; i < 30; i++) {
        res.push(TITANIUM(3));
    }
    for(let i = 0; i < 30; i++) {
        res.push(TITANIUM(4));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ENERGY(200));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ENERGY(500));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(10, 0));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(20, 0));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(40, -200));
    }
    for(let i = 0; i < 5; i++) {
        res.push(PORTAL(70, -400));
    }
    for(let i = 0; i < 5; i++) {
        res.push(PORTAL(100, -700));
    }
    for(let i = 0; i < 2; i++) {
        res.push(PORTAL(200, -500));
    }
    for(let i = 0; i < 2; i++) {
        res.push(PORTAL(300, -500));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ORGANIZED(-10));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ORGANIZED(-30));
    }
    for(let i = 0; i < 3; i++) {
        res.push(ORGANIZED(-100));
    }
    res.push(...res);
    res.push(...res);
    res.push(...res);
    for(let i = 0; i < res.length; i++){
        res[i] = {...res[i], id: i};
    }
    return res;
}