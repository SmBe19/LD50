import {Lobby} from 'boardgame.io/react';
import {EntropyRally} from "./Game";
import {EntropyRallyBoard} from "./Board";
import './Lobby.css';

function goFullscreen() {
    const els = document.getElementsByClassName('bgio-client');
    if (els && els.length > 0) {
        const element = els[0];
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
}

const MultiplayerApp = () => (
    <div>
        <h1 className="lobby-title">Entropy Rally Lobby</h1>
        <div className="rules"><a rel="noreferrer" target="_blank" href="https://github.com/SmBe19/LD50/blob/master/rules.md">Rules</a></div>
        <Lobby
            gameServer="https://entropyrally.ludumdare.games.smeanox.com"
            lobbyServer="https://entropyrally.ludumdare.games.smeanox.com"
            gameComponents={[
                {game: EntropyRally, board: EntropyRallyBoard}
            ]}
        />
        <div className="go-fullscreen">
            <button onClick={() => goFullscreen()}>Open game in fullscreen</button>
        </div>
    </div>
);

export default MultiplayerApp;
