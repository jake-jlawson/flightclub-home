/** Donkey Derby Game Logic
 * @fileoverview File provides states and logic for the donkey derby game
 * - Stores states
 * - Provides logic
*/
/*IMPORTS*/
import React, { createContext, useState, useEffect, useContext } from 'react';
import { boardConvert, generateNumbers } from '../../utils/GameUtils';
import DonkeyDerbyTeam from './parts/Team';

/*MINIGAME CONTEXT*/
const DonkeyDerbyContext = createContext();
export const useDonkeyDerby = () => useContext(DonkeyDerbyContext);


/*DONKEY DERBY PROVIDER*/
export const DonkeyDerbyLogicProvider = ({ children, dd_teams }) => {
    
    /**CONFIG */
    const config = {
        pointsToWin: 8
    }
    
    /**STATES
     * @var {Array[DonkeyDerbyTeam]} teams - teams that are playing the game
     * @var {DonkeyDerbyTeam} activeTeam - the team that is currently active
     */
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);


    /**EFFECTS
     * @effect LOAD TEAMS - loads the teams into the game
     */
    useEffect(() => {
        //Generate set of board numbers
        let board_numbers = generateNumbers(dd_teams.length);

        //Traverse teams input and create DonkeyDerbyTeam objects
        let teams_list = [];
        dd_teams.forEach((team, index) => {

            //Assign team members
            let new_team = new DonkeyDerbyTeam(index, team); //Create new team object
            new_team.assignNumber(board_numbers.pop()); //Assign board number
            new_team.giveDonkey(); //Assign donkey

            teams_list.push(new_team); //Add team to list
        });

        setTeams(teams_list);
        setActiveTeam(teams_list[0]);
    }, [dd_teams]);


    /**FUNCTIONS */
    const addPoints = (team, number_of_points) => {
        //Find team in team state and update whole team state immutably
        setTeams(teams.map((t) => {
            if (t.id === team.id) {
                t.points += number_of_points;
            }
            return t;
        }));
    }

    const nextTeam = () => {
        //Find current team index
        let current_index = teams.findIndex((team) => team.id === activeTeam.id);

        //Find next team index
        let next_index = (current_index + 1) % teams.length;

        //Set next team as active
        setActiveTeam(teams[next_index]);
    }
    









    const to_export = {
        teams,
        activeTeam,
        config,
        addPoints,
        nextTeam
    }

    return (
        <DonkeyDerbyContext.Provider value={to_export}>
            {children}
        </DonkeyDerbyContext.Provider>
    );
}


