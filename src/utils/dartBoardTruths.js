
// Dart board angles
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

// Dart board numbers
const dartNumbers = {
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

/** Dart Board Conversion
 * @function boardConvert dart board numbers to angles and vice versa
 * 
 * @param {string/int} input - dart board number or angle
 * @returns {int/string} - dart board angle or number*/
 
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


/** Generate Numbers
 * @function generateNumbers generates a set of dart board numbers for a given number of teams*/

export function generateNumbers(numberOfTeams) {
    //Initial array to hold number values
    let numbers = [];
            
    //Generate initial values
    let startingNumber = Math.floor(Math.random() * 20) + 1; //starting number
    numbers.push(startingNumber.toString());

    
    switch (numberOfTeams) {
        
        case 2: //2 Players
            let max_angle = 360 / numberOfTeams;
            let min_angle = 60;
        
            //Generate a clockwise angle
            var angleDelta = Math.floor(Math.random() * (max_angle - min_angle + 1) + min_angle);
            angleDelta = Math.floor(angleDelta / 18) * 18; //covert to multiple of 18

            var player2Angle = (((dartAngles[startingNumber] + angleDelta) % 360) + 360) % 360;
            numbers.push(dartNumbers[player2Angle]);

            break;

        case 3: //3 Players
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

        case 4: //4 Players
            //Initial angle
            var player1Angle = dartAngles[startingNumber];

            for (let i = 1; i < 4; i++) {
                var playerAngle = player1Angle + (i * 90);
                playerAngle = ((playerAngle % 360) + 360) % 360;
                numbers.push(dartNumbers[playerAngle]);
            }

            break;

        case 5: //5 Players
            //initial angle
            var player1Angle = dartAngles[startingNumber];

            for (let i = 1; i < 5; i++) {
                var playerAngle = player1Angle + (i * 72);
                playerAngle = ((playerAngle % 360) + 360) % 360;
                numbers.push(dartNumbers[playerAngle]);
            }

            break;

        case 6: //6 Players
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
