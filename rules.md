# Entropy Rally

Entropy is increasing and the heat death of the universe is inevitable. But there is hope! Scientists recently found a second universe, but building a new civilization there will take a lot of titanium and getting it there is very energy intensive. A few brave adventurers venture into space to gather as much as possible before the old universe dies.

## Setup
The starting player token is given to a random player. Place 1000 entropy tokens on the entropy bar: the entropy starts at -1000. Shuffle the tiles and all cards.

In turn, each player draws a random tile and places it adjacent to an existing tile. This is repeated until every player placed 5 tiles. Perform the actions denoted on the tiles.

In turn, each player receives one ship and places it on a tile of their choice. No two ships may be placed on the same tile or directly adjacent to each other.

The game now progresses in eras until entropy reaches zero.

## Era
Each era progresses in multiple consecutive phases, in the order as they are described. If something is stated to happen in turns, this always starts with the current starting player.

### Draw cards
Each player draws 5 cards for each ship they own.

### Production
Each energy portal has an associated entropy level after which it stops working. An energy portal is considered active if the global entropy level is not above its level.

A player receives the denoted amount of energy for all its active energy portals and the global entropy increases by the same amount. Entropy is capped at zero and as soon as entropy reaches zero, it will never decrease again (even if corresponding cards or tiles would be played) and this is the last era.

Additionally, each player receives 50 energy for free.

In turn, each player distributes all their energy onto their ships.

### Planning
During the planning phase the moves for the chaos phase are chosen. For each ship a player lays down an arbitrary number of cards face down in the order they should be played. There is no lower or upper limit on the number of cards to be played.

### Chaos
The chaos phase consists of multiple rounds.

In each round, first all lasers and gravitational waves are moved by one tile.

If a ship is hit by a laser, it loses 2 energy. The laser disappears. If the ship has now less than zero energy, all its titanium is discarded and the ship is removed from the game. If a player does not have any ships left, they can no longer play and their final score is the number of points they currently have.

If a ship is hit by a gravitational wave, it is moved one tile into the direction of the wave. The wave disappears.

Then, in turn, each player plays the first card for all its ships (if there is still a card left) and discards the amount of energy denoted on the card from the energy storage of this ship. If applicable, they adjust the global entropy level. They may choose the order in which they perform the action for their ships. If a ship does not have enough energy left for an action, this action is ignored. Afterwards, the cards are discarded and the next card in order becomes the "first" card. This is repeated until all cards were played.

If a ship moves off the tiles, it is destroyed.

If multiple ships of the same player land on the same tile, the player may exchange any number of titanium and energy between the ships.

If multiple ships of different players land on the same tile, there is an epic space battle. Each ship loses the amount of energy all the ships of other players have combined. If a ship does not have any energy left, it is removed from the game and all its resources are discarded. In the usual case where there is exactly one ship from each player, this means that only the ship with more energy survives but loses as much energy as the other ship had.

If a ship lands on a tile with an energy portal, this player now owns this energy portal and they place one of their tokens on the tile and remove any other tokens.

If a ship lands on a tile with titanium or energy on it, all of them are added to the ship's storage.

### Expansion
The starting player draws three tiles and places each of them adjacent to an existing tile. If the tile has any action associated with it, this action is now performed.

### End of an era
The starting player token moves to the next player.

If the entropy is at zero, the game ends and the player with the most points wins.

## Tiles
Tiles are hexagon shaped. They are placed at the start and during the expansion phase. New tiles have to be placed adjacent to existing tiles. There are the following types of tiles:

### Space
Empty tiles, nothing happens here.

### Titanium
Contains the specified number of titanium. When a ship lands on this tile, the titanium is moved to the ship. When placing, place the specified number of titanium on it.

### Energy
Contains the specified number of energy. When a ship lands on this tile, the energy is moved to the ship. When placing, place the specified number of energy on it.

### Energy Portal
The energy portal can transfer energy into the universe, but increases entropy by doing so. An energy portal has a specified number of energy it produces each era. However, it can only operate if the global entropy level is below the threshold indicated on the tile. Initially, the energy portal is not owned by anyone and does not produce any energy. Once a ship lands on the tile, ownership moves to this player.

### Neatly Organized Space
Reduces global entropy level by the specified amount when placed.

## Cards
Each card indicates the number of energy which is required to play it and optionally the change in entropy playing this card causes. There are the following types of cards:

### Move 1, Move 2, Move 3
Move the ship in its current direction 1, 2, or 3 steps (depending on card).

### Turn Right 60°, Turn Right 120°, Turn 180°, Turn Left 120°, Turn Left 60°
Turn the direction of the ship by the specified amount.

### Shoot Laser
Shoots a laser in the current direction. The laser token is placed one tile ahead of the ship's current tile. It will move one step each round.

### Send Gravitational Wave
Send out a gravitational wave in the current direction. The wave token is placed one tile ahead of the ship's current tile. It will move one step each round.

### Titanium Portal
Open a portal into the new universe and transport any number of titanium currently on the ship. The required energy is independent of the amount of titanium transported. The transported titanium is removed from the ship and the player receives a point for each transported titanium.

### Build Ship
The player receives an additional ship. They may place the ship on any tile adjacent to the ship which played the card.

### Tidy Up Space
Reduce global entropy by the specified amount.
