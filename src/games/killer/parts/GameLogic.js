
/** Killer Game Logic
 * @fileoverview File provides states and logic for the killer game
 * - Stores states for the killer game
 * - Provides logic for the killer game
*/
/*IMPORTS*/
import React, { createContext, useState, useEffect, useContext } from 'react';

/*MINIGAME CONTEXT*/
const KillerContext = createContext();
export const useKiller = () => useContext(KillerContext);


/*KILLER GAME PROVIDER*/
export const KillerLogicProvider = ({ children, killer_teams }) => {

    /** CONFIG VARIABLES
     * Variables to configure the killer game
     * @var {int} maxRounds - Maximum number of rounds in the game
     * @var {int} doublesRound - Round number to activate doubles multiplier
     * @var {int} triplesRound - Round number to activate triples multiplier
     */
    const config = {
        maxRounds: 12,
        doublesRound: 7,
        triplesRound: 10,
    }

    /**FIXED VARIABLES
     * Utility variables for the killer game
    */
    const dartAngles = {
        "6": 0,
        "13": 18,
        "4": 36,
        "18": 54,
        "1": 72,
        "20": 90,
        "5": 108,
        "12": 126,
        "9": 144,
        "14": 162,
        "11": 180,
        "8": 198,
        "16": 216,
        "7": 234,
        "19": 252,
        "3": 270,
        "17": 288,
        "2": 306,
        "15": 324,
        "10": 342
    }

    const dartNumbers = {
        0: "6",
        18: "13",
        36: "4",
        54: "18",
        72: "1",
        90: "20",
        108: "5",
        126: "12",
        144: "9",
        162: "14",
        180: "11",
        198: "8",
        216: "16",
        234: "7",
        252: "19",
        270: "3",
        288: "17",
        306: "2",
        324: "15",
        342: "10"
    }

    

    /**STATES
     * @var {Array[KillerTeam]} teams - Array of team objects
     * @var {KillerTeam} activeTeam - Team currently playing
     * @var {Object} scores - Object containing scores for each team
     * @var {int} roundNumber - Current Round Number
     * @var {int} multiplier - Multiplier for the current round
     * @var {bool} gameActive - Boolean indicating if the game is active
     */
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);
    const [scores, setScores] = useState({});
    const [roundNumber, setRoundNumber] = useState(1);
    const [multiplier, setMultiplier] = useState(1);
    const [gameActive, setGameActive] = useState(true);
    

    /**USE EFFECTS
     * @description - Automatic updates based on state changes
     */
    //Update multiplier at certain round numbers
    useEffect(() => { 
        
        if (roundNumber === config.doublesRound) { //doubles multiplier
            setMultiplier(2);
        }

        if (roundNumber === config.triplesRound) { //triples multiplier
            setMultiplier(3);
        }

        if (roundNumber > config.maxRounds) { //End game if max rounds reached
            console.log("Game Over");
            setGameActive(false);
        }

    }, [roundNumber])

    //Instantiate teams
    useEffect(() => { 

        const generateNumbers = (numberOfTeams) => {

            //Initial array to hold number values
            let numbers = [];
            
            //Generate initial values
            let startingNumber = Math.floor(Math.random() * 20) + 1; //starting number
            numbers.push(startingNumber.toString());

            
            switch (numberOfTeams) {
                
                case 2:
                    let max_angle = 360 / numberOfTeams;
                    let min_angle = 60;
                
                    //Generate a clockwise angle
                    var angleDelta = Math.floor(Math.random() * (max_angle - min_angle + 1) + min_angle);
                    angleDelta = Math.floor(angleDelta / 18) * 18; //covert to multiple of 18

                    var player2Angle = (((dartAngles[startingNumber] + angleDelta) % 360) + 360) % 360;
                    numbers.push(dartNumbers[player2Angle]);

                    break;

                case 3:
                    //Initial angle
                    var player1Angle = dartAngles[startingNumber];

                    //Generate second player
                    var player2Angle = player1Angle + 6*18;
                    player2Angle = ((player2Angle % 360) + 360) % 360;
                    numbers.push(dartNumbers[player2Angle]);

                    //Generate third player
                    var player3Angle = player2Angle + 7*18;
                    player3Angle = ((player3Angle % 360) + 360) % 360;
                    numbers.push(dartNumbers[player3Angle]);

                    break;

                case 4:   
                    //Initial angle
                    var player1Angle = dartAngles[startingNumber];

                    for (let i = 1; i < 4; i++) {
                        var playerAngle = player1Angle + (i * 90);
                        playerAngle = ((playerAngle % 360) + 360) % 360;
                        numbers.push(dartNumbers[playerAngle]);
                    }

                    break;

                case 5:
                    //initial angle
                    var player1Angle = dartAngles[startingNumber];

                    for (let i = 1; i < 5; i++) {
                        var playerAngle = player1Angle + (i * 72);
                        playerAngle = ((playerAngle % 360) + 360) % 360;
                        numbers.push(dartNumbers[playerAngle]);
                    }

                    break;

                case 6:
                    //initial angle
                    var player1Angle = dartAngles[startingNumber];
                    let angle = player1Angle;

                    //First 3 players
                    for (let i = 1; i < 6; i++) {
                        
                        if (i === 3) {
                            var angleDelta = 72;
                        } else {
                            var angleDelta = 54;
                        }

                        console.log("Delta: ", angleDelta);
                        
                        angle = angle + angleDelta;
                        console.log("Current Angle: ", angle);
                        angle = ((angle % 360) + 360) % 360;
                        numbers.push(dartNumbers[angle]);
                    }

                    break;

                default:
                    console.error("Number of teams not supported: ", numberOfTeams);
                    break;
            }

            return numbers;
        }

        let number_options = generateNumbers(killer_teams.length);
        
        //Create Killer Teams
        let team_list = [];
        killer_teams.forEach((team, index) => {
            
            let new_team = new KillerTeam(index, team);
            new_team.assignNumber(number_options.pop()); //asign team's number
            
            team_list.push(new_team);
        });

        setTeams(team_list);
        setActiveTeam(team_list[0]);

    }, [killer_teams])


    /**FUNCTIONS
     * @description - Functions to handle game logic
     */
    const nextRound = () => {
        
        if (roundNumber >= config.maxRounds) {
            console.error("You have reached the end of the game");
            return;
        }
        
        console.log("Moving to Round: ", roundNumber + 1);
        setRoundNumber(roundNumber + 1);
    }

    const nextTeam = () => {
        let currentIdx = teams.indexOf(activeTeam);

        if (currentIdx === teams.length - 1) {
            setActiveTeam(teams[0]);
            setRoundNumber(roundNumber + 1);
        } else {
            setActiveTeam(teams[currentIdx + 1]);
        }
    }



    const context_vals = {
        config,
        dartAngles,
        teams,
        roundNumber,
        setRoundNumber,
        scores,
        setScores,
        multiplier,
        gameActive,
        nextRound,
        nextTeam,
        activeTeam
    };

    return (
        <KillerContext.Provider value={context_vals}>
            {children}
        </KillerContext.Provider>
    )

}


/*KILLER TEAM CLASS*/
class KillerTeam {
    constructor(id, players) {
        this.id = id.toString();
        this.players = players;
        this.isKiller = false;
        this.score = 0;

        this.color = this.setColor();
    }

    setIsKiller(isKiller) {
        this.isKiller = isKiller;
    } 

    assignNumber(number) {
        this.board_number = number;
    }

    setColor() {
        const playerColors = [
            "#00a6f2",
            "#f0cf2e",
            "#f05b8d",
            "#07ab1d",
            "#991dcf",
            "#124fb3",
            "#b31f12"
        ]

        return playerColors[this.id];
    }
}

