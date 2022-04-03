// src/server.js
const { Server, Origins } = require('boardgame.io/server');
const {EntropyRally} = require("./Game");

const server = Server({
    games: [EntropyRally],
    origins: [Origins.LOCALHOST_IN_DEVELOPMENT, 'https://ludumdare.games.smeanox.com'],
});

server.run(30480);
