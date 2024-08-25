
/** SCREEN: GAME
 * @screen File serves the player input screen
 * - Provides initial screens for game preparation (team instantiation, settings, loading screens, etc.)
 * - Hosts the game once the game is initialised.
*/
/*Imports*/
import React, { useEffect, useState } from 'react';
import './Game.css';

//Context Imports
import { GameDisplay } from '../../contexts/GameDisplay';
import { useGameWindow } from '../../contexts/GameDisplay';
import { useGames } from '../../contexts/GameContext';

//Component Imports
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';


/*COMPONENT DEFINITION*/
export default function Game() {
    


    //Hooks
    const { openGameWindow } = useGameWindow();
    const { games } = useGames();

    //Open Game Window on Start
    useEffect(() => {
        openGameWindow();
    }, []);
    
    const game = games[2];
    
    
    return (
        <div id="Game" className='screen'>
            <GameStart game={game} />
        </div>
    )
}



function GameStart({ game }) {
    
    if (!game) {
        console.log("No logo found yet...");
        return (<p>Loading...</p>)
    } else {
        console.log("Logo found!", game.logo);
        
        return (
            <>
            {/*Control Screen*/}
            <div 
                id="gameStartControl" 
                className='screen game-start'
                style={{
                    background: game.getGradient()
                }}>
                <BorderDecoration />
            </div>


            {/*Game Screen*/}
            <GameDisplay>
                <div
                    id="gameStartScreen"
                    className='screen game-start'
                    style={{
                        background: game.getGradient()
                    }}
                >
                    
                    <BorderDecoration fc_logo={true} />

                    <img src={game.logo} alt="Game Logo" className='game-logo'/>
                </div>
            </GameDisplay>
            </>
        )
    }
}