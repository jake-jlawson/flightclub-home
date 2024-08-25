
/** FLIGHTCLUB HOME: FRONTEND ENTRY POINT
 * @fileoverview File serves as the entry point for the frontend application
 * - Provides app routing and screen logic
*/

/*Imports*/
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

/*Context Imports*/
import { GameProvider } from './contexts/GameContext';
import { GameWindowProvider } from './contexts/GameDisplay';
import { PlayerProvider, Player } from './contexts/PlayerContext';

/*Component Imports*/
import GameSelect from './screens/GameSelect/GameSelect';
import Start from './screens/Start/Start';
import GameWindow from './screens/GameWindow/GameWindow';
import PlayerInput from './screens/PlayerInput/PlayerInput';
import PlayerConfig from './screens/PlayerConfig/PlayerConfig';
import Game from './screens/Game/Game';

import Killer from './games/killer/Killer';


const container = document.getElementById('root');
const root = createRoot(container);


//Tests
//create some test players
const player1 = new Player("Jake", "https://via.placeholder.com/150", 1);
const player2 = new Player("Simon", "https://via.placeholder.com/150", 1);
const player3 = new Player("Carolyn", "https://via.placeholder.com/150", 1);
const player4 = new Player("Josh", "https://via.placeholder.com/150", 1);
//create some test teams
// const teams = [[player1], [player2], [player3, player4]];
const teams = [[player1], [player2], [player3, player4], [player1], [player1]];


/** APP COMPONENT
 * @component provides the primary component for rendering the app entry point*/
root.render(
    <GameWindowProvider>
        <GameProvider>
            <PlayerProvider>
                <HashRouter>
                    <Routes>
                        {/*Main window routes*/}
                        <Route path="/" element={<Killer teams={teams}/>} />
                        <Route path="/player-config" element={<PlayerConfig/>} />
                        <Route path="/player-input" element={<PlayerInput/>} />

                        {/*Game select route*/}
                        <Route path="/game-select" element={<GameSelect/>} />

                        {/*Game window rendering route*/}
                        <Route path="/game-window" element={<GameWindow/>} /> 
                    </Routes>
                </HashRouter>
            </PlayerProvider>
        </GameProvider>
    </GameWindowProvider>
);