
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

/*Component Imports*/
import GameSelect from './screens/GameSelect/GameSelect';
import Start from './screens/Start/Start';


const container = document.getElementById('root');
const root = createRoot(container);


/** APP COMPONENT
 * @component provides the primary component for rendering the app entry point*/
root.render(
    <HashRouter> {/*app routes*/}
        <Routes>
            <Route path="/" element={<Start/>} />
            <Route path="/second-screen" element={<></>} />
        </Routes>
    </HashRouter>
);