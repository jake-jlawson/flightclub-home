
/** CONTEXT: PLAYERS
 * @fileoverview Provides context for the management of players and player data
 * - Provides a player class for player data
 * - Keeps track of current players
 * - Provides interface for adding and removing players
*/

/*Imports*/
import React, { useState, useEffect, useContext, createContext } from 'react';


const PlayerContext = createContext({});
export function usePlayers() { //Players custom hook
    return useContext(PlayerContext);
}


/*PLAYER CONTEXT PROVIDER*/
export function PlayerProvider({ children }) {

    // Globally available states and methods
    const [players, setPlayers] = useState([]); //state to store players

    const addPlayer = (player_name, player_pic) => {
        const newPlayer = new Player(player_name, player_pic);
        setPlayers([...players, newPlayer]);
    }



    const context = {
        players,
        setPlayers
    };

    return (
        <PlayerContext.Provider value={context}>
            {children}
        </PlayerContext.Provider>
    );
}



/*PLAYER CLASS*/
class Player {
    constructor(name, pic) {
        this.id = 0;
        this.name = name;
        this.img = pic;

        this.medals = {
            gold: 0,
            silver: 0,
            bronze: 0
        };

        this.points = 0;
    }

    getPoints() {
        this.calculatePoints();

        return this.points;
    }

    calculatePoints() {
        this.points = this.medals.gold * 3 + this.medals.silver * 2 + this.medals.bronze;
    }
}