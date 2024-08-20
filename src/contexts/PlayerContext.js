
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


    /** ADD PLAYER
     * @function addPlayer Adds a new player to the players list*/
    const addPlayer = (player_name, player_pic) => {
        
        let number_of_players = players.length;
        
        if (number_of_players === 12) { //check for max players
            console.error("Max players reached");
            return;
        }
        
        const newPlayer = new Player(player_name, player_pic, number_of_players);
        setPlayers([...players, newPlayer]);
    }


    /** REMOVE PLAYER
     * @function removePlayer Remove player from the players list*/
    const removePlayer = (player_id) => {
        
        let updatedPlayers = players.filter(player => player.id !== player_id);
        setPlayers(updatedPlayers);
    }





    useEffect(() => {
        console.log("Players: ", players);
    }, [players])



    const context = {
        players,
        addPlayer,
        removePlayer
    };

    return (
        <PlayerContext.Provider value={context}>
            {children}
        </PlayerContext.Provider>
    );
}



/*PLAYER CLASS*/
export class Player {
    constructor(name, pic, id) {
        this.id = id;
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