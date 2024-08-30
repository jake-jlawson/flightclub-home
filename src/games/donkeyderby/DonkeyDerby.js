/** GAME: Donkey Derby
 * @fileoverview File serves the donkey derby game and handles game logic
 * - Provides the entry point for the donkey derby game
*/
/*IMPORTS*/
import * as React from 'react';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Color from 'color';
import './DonkeyDerby.css';

// Component and Context Imports
import { GameDisplay } from '../../contexts/GameDisplay';
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';
import GamePlayerIcon from '../../components/GamePlayerIcon/GamePlayerIcon';

import { useGameWindow } from '../../contexts/GameDisplay';
import { useGame } from '../../contexts/GameContext';

// Game Logic Imports
import { DonkeyDerbyLogicProvider, useDonkeyDerby } from './GameLogic';
import GameScreen from './parts/GameScreen';



/** DONKEY DERBY COMPONENT*/
export default function DonkeyDerby({ teams }) {
    
    const { openGameWindow } = useGameWindow();
    useEffect(() => openGameWindow(), []);
    
    
    return (
        <DonkeyDerbyLogicProvider dd_teams={teams}>

            {/*Game Screen*/}
            <GameDisplay>
                <BorderDecoration fc_logo={true}/>
                <GameScreen/>
            </GameDisplay>

            {/*Control Window*/}
            <ControlWindow/>

        </DonkeyDerbyLogicProvider>
    );
}


/** CONTROL WINDOW COMPONENT
 * @component renders the control window for the donkey derby game*/
function ControlWindow() {
    
    const { activeTeam, addPoints, nextTeam } = useDonkeyDerby();

    return (
        <div id="ddControlWindow" className='screen'>
            <button onClick={() => {
                addPoints(activeTeam, 1);
            }}>
                Add Point
            </button>
            <button onClick={nextTeam}>
                Next Team
            </button>
        </div>
    );
}