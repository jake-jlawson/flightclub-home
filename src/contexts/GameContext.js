/* 
    CONTEXT: GAME CONTEXT FILE
    __Allows importing and global access to game data
*/
/*IMPORTS*/
import React, { useState, createContext, useContext, useEffect } from "react";


/*CREATE GAME CONTEXT*/
const GameContext = createContext({});
export function useGames() { // Custom hook to use the game context
    return useContext(GameContext);
}


/*DYNAMIC GAME IMPORTS*/
const gameComponentContext = require.context('../games', true, /^\.\/[^\/]+\/[^\/]+\.js$/);
const gameDataContext = require.context('../games', true, /^\.\/[^\/]+\/game\.json$/);
const gameLogoContext = require.context('../games', true, /\/[^\/]+\/logo2\.png$/);
const gameLogoStandardContext = require.context('../games', true, /\/[^\/]+\/logo_standard\.png$/);
const gameIconContext = require.context('../games', true, /\/[^\/]+\/icon\.png$/);



/*GAME CONTEXT PROVIDER*/
export function GameProvider({ children }) {

    // Globally available states and methods
    const [games, setGames] = useState([]); //state to store games


    // Load games on app start
    useEffect(() => {
        const loadedGames = gameComponentContext.keys().map((key) => {

            let gameID = key.split('/')[1]; // Extract game name from path


            // Load corresponding game data
            const dataKey = gameDataContext.keys().find(dataKey => dataKey.includes(`/${gameID}/game.json`));
            const gameData = dataKey ? gameDataContext(dataKey) : {};

            // Load corresponding logo
            const logoKey = gameLogoContext.keys().find(logoKey => logoKey.includes(`/${gameID}/logo2.png`));
            const gameLogo = logoKey ? gameLogoContext(logoKey).default : null;

            // Load corresponding standard logo
            const logoStandardKey = gameLogoStandardContext.keys().find(logoStandardKey => logoStandardKey.includes(`/${gameID}/logo_standard.png`));
            const gameLogoStandard = logoStandardKey ? gameLogoStandardContext(logoStandardKey).default : null;

            // Load corresponding icon
            const iconKey = gameIconContext.keys().find(iconKey => iconKey.includes(`/${gameID}/icon.png`));
            const gameIcon = iconKey ? gameIconContext(iconKey).default : null;

            // Load game component (entry point)
            const gameComponent = gameComponentContext(key).default;


            return new Game(gameID, gameLogo, gameLogoStandard, gameIcon, gameData, gameComponent);
        });

        setGames(loadedGames);
    }, [])


    // Collect available states and methods for export
    const context = {
        games
    }
    
    return (
        <GameContext.Provider value={context}>
            {children}
        </GameContext.Provider>
    );
}


/*GAME CLASS - For encapsulating game information and game components*/
class Game {
    constructor(id, logo, logo_standard, icon, data, entry_point) {
        this.id = id;
        this.logo = logo;
        this.logo_standard = logo_standard;
        this.icon = icon;

        this.parseData(data);
        
        this.entry_point = entry_point;
    }

    parseData(data) {
        this.name = data.name;
        this.description = data.description;

        this.gradient = data.gradient;
    }

    getGradient() {
        
        if (!this.gradient) {
            console.error("No gradient found for game", this.id)
            return "#3f3b2c";
        } else {
            return `linear-gradient(180deg, ${this.gradient.start} 0%, ${this.gradient.end} 50%)`;
        }
        
    }
}