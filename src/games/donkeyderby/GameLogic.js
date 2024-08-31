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
        pointsToWin: 8,
        maxRounds: 12
    }
    
    /**STATES
     * @var {Array[DonkeyDerbyTeam]} teams - teams that are playing the game
     * @var {DonkeyDerbyTeam} activeTeam - the team that is currently active
     * @var {int} roundNumber - the current round number
     */
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);
    const [roundNumber, setRoundNumber] = useState(1);
    const [currentGoScore, setCurrentGoScore] = useState({
        1: [0, 1],
        2: [0, 2],
        3: [0, 3]
    });


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
        //Set current go score to team score
        addPoints(activeTeam, currentGoScore[1] + currentGoScore[2] + currentGoScore[3]);
        
        
        //Find current team index
        let current_index = teams.findIndex((team) => team.id === activeTeam.id);

        //Find next team index
        let next_index = (current_index + 1) % teams.length;

        //Check if next team is the first team
        if (next_index === 0) {
            nextRound();
        }

        //Set next team as active
        setActiveTeam(teams[next_index]);
        setCurrentGoScore({
            1: 0,
            2: 0,
            3: 0
        });
    }

    const nextRound = () => {
        if (roundNumber >= config.maxRounds) {
            console.error("You have reached the end of the game");
            return;
        }
        
        console.log("Moving to Round: ", roundNumber + 1);
        setRoundNumber(roundNumber + 1);
    }

    const scoreUpdater = {
        set1: (score) => setCurrentGoScore({...currentGoScore, 1: score}),
        set2: (score) => setCurrentGoScore({...currentGoScore, 2: score}),
        set3: (score) => setCurrentGoScore({...currentGoScore, 3: score}),
        get1: () => currentGoScore[1],
        get2: () => currentGoScore[2],
        get3: () => currentGoScore[3]
    }









    const to_export = {
        teams,
        activeTeam,
        config,
        addPoints,
        nextTeam,
        roundNumber,
        nextRound,
        currentGoScore,
        scoreUpdater
    }

    return (
        <DonkeyDerbyContext.Provider value={to_export}>
            {children}
        </DonkeyDerbyContext.Provider>
    );
}


