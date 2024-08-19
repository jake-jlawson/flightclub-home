
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
import { PlayerProvider } from './contexts/PlayerContext';

/*Component Imports*/
import GameSelect from './screens/GameSelect/GameSelect';
import Start from './screens/Start/Start';
import GameWindow from './screens/GameWindow/GameWindow';
import PlayerInput from './screens/PlayerInput/PlayerInput';


const container = document.getElementById('root');
const root = createRoot(container);


/** APP COMPONENT
 * @component provides the primary component for rendering the app entry point*/
root.render(
    <GameWindowProvider>
        <GameProvider>
            <PlayerProvider>
                <HashRouter>
                    <Routes>
                        {/*Main window routes*/}
                        <Route path="/" element={<PlayerInput/>} />
                        <Route path="/player-input" element={<></>} />

                        {/*Game window rendering route*/}
                        <Route path="/game-window" element={<GameWindow/>} /> 
                    </Routes>
                </HashRouter>
            </PlayerProvider>
        </GameProvider>
    </GameWindowProvider>
);