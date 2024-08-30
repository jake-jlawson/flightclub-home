
/**GAME UTILS
 * @fileoverview File provides utility functions for games
 */


/**@class GameTeam - provides a team glass for games to use */
export class GameTeam {
    
    /**CONSTRUCTOR
     * @param {Number} id - unique team id
     * @param {Array[Player]} players - players in the team
     * @param {String} color - team color
     * @param {Player} activePlayer - current active player
     * @param {Number} board_number - assigned board number for the team
    */
    constructor(id, players) {
        this.id = id.toString();
        this.board_number = null;

        this.players = players;
        this.activePlayer = players[0];

        this.color = this.setColor();
    }


    /**METHODS*/
    /** @method assignNumber - assign a board number to the team*/
    assignNumber(number) {
        this.board_number = number;
    }

    /** @method setColor - set the teams color*/
    setColor() { //set team color
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

    /** @method newPlayer - move to the next playing player*/
    nextPlayer() { //move to next player
        let currentIdx = this.players.indexOf(this.activePlayer);

        if (currentIdx === this.players.length - 1) {
            this.activePlayer = this.players[0];
        } else {
            this.activePlayer = this.players[currentIdx + 1];
        }
    }
}


/**@function boardConvert - convert between board angles and numbers */
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

export function boardConvert(input) {
    
    if (typeof input === "string") {
        return dartNumbers[input];
    } else if (typeof input === "number") {
        return dartAngles[input];
    } else {
        console.error("Invalid input type: ", input);
        return null;
    }
}


/**@function generateNumbers - generate a set of board numbers */
export function generateNumbers(numberOfTeams) {
    
    //Initial array to hold number values
    let numbers = [];
        
    //Generate initial values
    let startingNumber = Math.floor(Math.random() * 20) + 1; //starting number
    numbers.push(startingNumber.toString());

        
    //Logic for different numbers of teams
    switch (numberOfTeams) {
            
        case 2:
            let max_angle = 360 / numberOfTeams;
            let min_angle = 60;
            
            //Generate a clockwise angle
            var angleDelta = Math.floor(Math.random() * (max_angle - min_angle + 1) + min_angle);
            angleDelta = Math.floor(angleDelta / 18) * 18; //covert to multiple of 18

            var player2Angle = (((dartAngles[startingNumber] + angleDelta) % 360) + 360) % 360;
            numbers.push(dartNumbers[player2Angle]); //add to numbers array

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
            numbers.push(dartNumbers[player3Angle]); //add to numbers array

            break;

        case 4:   
            //Initial angle
            var player1Angle = dartAngles[startingNumber];

            for (let i = 1; i < 4; i++) {
                var playerAngle = player1Angle + (i * 90);
                playerAngle = ((playerAngle % 360) + 360) % 360;
                numbers.push(dartNumbers[playerAngle]); //add to numbers array
            }

            break;

        case 5:
            //initial angle
            var player1Angle = dartAngles[startingNumber];

            for (let i = 1; i < 5; i++) {
                var playerAngle = player1Angle + (i * 72);
                playerAngle = ((playerAngle % 360) + 360) % 360;
                numbers.push(dartNumbers[playerAngle]); //add to numbers array
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
                numbers.push(dartNumbers[angle]); //add to numbers array
            }

            break;

        default:
            console.error("Number of teams not supported: ", numberOfTeams);
            break;
    }

    return numbers;
}

