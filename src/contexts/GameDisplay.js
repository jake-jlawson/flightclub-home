
/** CONTEXT: GAME DISPLAY
 * @fileoverview File serves supports the display of content on the game display screen
 * - Provides a portal component for rendering content on the game display screen
*/

/*Imports*/
import React, { useEffect, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';

import GameWindow from '../screens/GameWindow/GameWindow';


/** GAME WINDOW CONTEXT
 * @context instantiates context for controlling and maintaining the game window*/
const GameWindowContext = createContext({});

export function useGameWindow() { // Custom hook to use the game window context
    return useContext(GameWindowContext);
}


/** GAME WINDOW PROVIDER
 * @context_provider provides game window context*/
export function GameWindowProvider({ children }) {

    const [gameWindow, setGameWindow] = useState(null); // game window reference
    const [gameWindowRoot, setGameWindowRoot] = useState(null); // game window root reference

    //Open the game window
    const openGameWindow = () => {
        if (gameWindow) { // check for already open game window
            console.log("Game Window Already Opened", gameWindow);
            return;
        }

        const gameWindowURL = `${window.location.href}/#/game-window`;
        let win = window.open(gameWindowURL, "game-window", ""); //open window with game window route
        
        setGameWindow(win);
    };


    //Handle window close
    useEffect(() => {
        if (gameWindow) {
            const handleWindowClose = () => {
                setGameWindow(null);
                setGameWindowRoot(null);
            };
            
            gameWindow.addEventListener('unload', handleWindowClose);

            return () => {
                gameWindow.removeEventListener('unload', handleWindowClose);
            };
        }
    }, [gameWindow]);


    //Set the game window root
    useEffect(() => {
        if (gameWindow) {
            const intervalId = setInterval(() => {
                const root = gameWindow.document.getElementById('game-window-root');
                if (root) {
                    setGameWindowRoot(root);
                    clearInterval(intervalId);
                }
            });
        }
    }, [gameWindow]);
    
    
    //Global context variables
    const context = { 
        gameWindow,
        openGameWindow,
        gameWindowRoot
    }

    return (
        <GameWindowContext.Provider value={context}>
            {children}
        </GameWindowContext.Provider>
    );
}


/** GAME DISPLAY COMPONENT
 * @component provides a component for wrapping content that needs to be displayed in the game window*/
export function GameDisplay({ children }) {

    const { gameWindow, gameWindowRoot, openGameWindow } = useGameWindow();

    useEffect(() => {
        if (!gameWindow) { //check first if there is a game window
            console.log("No game window open!");
        } else {
            console.log("There is a game window open", gameWindow);  
        }
    }, [gameWindow, children])


    if (gameWindowRoot) {
        return ReactDOM.createPortal(children, gameWindowRoot); // remder portal
    }

    return null; //does not physically render anything in its location
}