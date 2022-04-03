import {Client} from 'boardgame.io/react';
import {Local} from "boardgame.io/multiplayer";
import {EntropyRally} from "./Game";
import {EntropyRallyBoard} from "./Board";

const EntropyRallyClient = Client({
    game: EntropyRally,
    board: EntropyRallyBoard,
    multiplayer: Local(),
    debug: false,
})

const App = () => (
    <div>
        <EntropyRallyClient playerID="0"/>
        <EntropyRallyClient playerID="1"/>
    </div>
);

export default App;
