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

export function multiplyArrayAndAddIds(arr, times, startId) {
    let res = arr.slice();
    for(let i = 0; i < times; i++) {
        res.push(...res);
    }
    for(let i = 0; i < res.length; i++){
        res[i] = {...res[i], id: i + startId};
    }
    return res;
}

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
    for(let i = 0; i < 5; i++) {
        res.push(TITANIUM(5));
    }
    for(let i = 0; i < 3; i++) {
        res.push(TITANIUM(6));
    }
    for(let i = 0; i < 30; i++) {
        res.push(ENERGY(100));
    }
    for(let i = 0; i < 30; i++) {
        res.push(ENERGY(200));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ENERGY(500));
    }
    for(let i = 0; i < 20; i++) {
        res.push(PORTAL(10, 0));
    }
    for(let i = 0; i < 20; i++) {
        res.push(PORTAL(20, 0));
    }
    for(let i = 0; i < 20; i++) {
        res.push(PORTAL(30, -200));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(50, -400));
    }
    for(let i = 0; i < 10; i++) {
        res.push(PORTAL(70, -500));
    }
    for(let i = 0; i < 3; i++) {
        res.push(PORTAL(150, -600));
    }
    for(let i = 0; i < 3; i++) {
        res.push(PORTAL(200, -700));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ORGANIZED(-20));
    }
    for(let i = 0; i < 20; i++) {
        res.push(ORGANIZED(-50));
    }
    for(let i = 0; i < 3; i++) {
        res.push(ORGANIZED(-200));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ORGANIZED(20));
    }
    for(let i = 0; i < 10; i++) {
        res.push(ORGANIZED(50));
    }
    for(let i = 0; i < 3; i++) {
        res.push(ORGANIZED(100));
    }
    return multiplyArrayAndAddIds(res, 3, 0);
}