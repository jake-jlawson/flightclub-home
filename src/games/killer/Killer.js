
/** GAME: Killer
 * @fileoverview File serves the killer game and handles killer game logic
 * - Provides the entry point for the killer game
*/
/*IMPORTS*/
import * as React from 'react';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Color from 'color';
import './parts/Killer.css';

// Component and Context Imports
import { GameDisplay } from '../../contexts/GameDisplay';
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';
import GamePlayerIcon from '../../components/GamePlayerIcon/GamePlayerIcon';

import { useGameWindow } from '../../contexts/GameDisplay';
import { useGame } from '../../contexts/GameContext';

// Game Logic Imports
import { useKiller, KillerLogicProvider } from './parts/GameLogic';

//Icon and Image imports
import KillerBoard from './parts/KillerBoard.png';



/*MAIN ENTRY POINT*/
export default function Killer({ teams }) {
    
    const { openGameWindow } = useGameWindow();
    useEffect(() => openGameWindow(), []);


    return (
        <KillerLogicProvider killer_teams={teams}>
            
            {/*Killer Game Screen*/}
            <GameDisplay>
                <BorderDecoration fc_logo={true}/>
                <KillerGameWindow />
            </GameDisplay>
    

            {/*Killer Control Window*/}
            {/* <BorderDecoration /> */}
            <KillerControlWindow />

        </KillerLogicProvider>
    );
}


/*CONTROL WINDOW*/
function KillerControlWindow() {

    const { nextRound, nextTeam, activeTeam } = useKiller();

    return (
        <div id="killerControlWindow" className='screen'>
            <button onClick={() => nextRound()}>Next Round</button>
            <button onClick={() => nextTeam()}>Next Team</button>
            Active team is team {activeTeam ? activeTeam.id : "None"}
        </div>
    );
}

/*GAME WINDOW*/
function KillerGameWindow() {
    
    const { roundNumber, nextRound, teams, dartAngles, activeTeam } = useKiller();

    //Game Window Sizing States
    const { gameWindowDimensions } = useGameWindow();
    const scoringAreaProportion = 0.75;

    useEffect(() => {
        console.log("Teams updated!");
    }, [teams])


    const getTeamIconProperties = (team, dimensions, r) => {

        //Handle Active Team
        if (activeTeam.id === team.id) {
            var radius = r * 1.1;
            var icon_height = "100px";
        } else {
            var radius = r;
            var icon_height = "80px";
        }

        let theta = -dartAngles[team.board_number];
        let center = [dimensions.width / 2, dimensions.height / 2];


        //Check left or right orientation
        let orientation;
        if (0 >= theta && theta >= -90) {
            orientation = [theta, "right"];
            console.log(orientation);
        } else if (-90 > theta && theta >= -270) {
            orientation = "left";
            console.log(orientation);
        } else if (-270 > theta && theta >= -360) {
            orientation = "right";
            console.log(orientation);
        }



        let x = center[0] + radius * Math.cos(theta * Math.PI / 180);
        let y = center[1] + radius * Math.sin(theta * Math.PI / 180);

        return [x, y, icon_height, theta, orientation];
    }

    const getIconTransform = (angle, orientation) => {
        
        //variables
        var translateX;

        if (orientation === "right") {
            translateX = 0;
        } else if (orientation === "left") {
            translateX = -100;
        }



        
        
        
        
        return `translate(${translateX}%, -50%)`;
    }

    const getTeamIconLocation = (team) => {

        var theta = -dartAngles[team.board_number];
        var orientation;
        var xpos;
        var ypos;

        console.log(team.team_icon_location);


        if ((0 >= theta && theta >= -90) || (-270 > theta && theta >= -360)) {
            //Right Orientation
            orientation = "right";
            var loc = team.team_icon_location[1];
            console.log("team icon location ", team.team_icon_location[1]);
            xpos = team.team_icon_location[1][0];
            ypos = team.team_icon_location[1][0];

        } else if (-90 > theta && theta >= -270) {
            //Left Orientation
            orientation = "left";
            var loc = team.team_icon_location[0];
            xpos = loc[0];
            ypos = loc[1];
        }

        //Icon Transform
        let transform = getIconTransform(theta, orientation);

        //Icon Height (Handle Active Team)
        if (activeTeam.id === team.id) {
            var icon_height = "100px";
        } else {
            var icon_height = "80px";
        }

        console.log(xpos);
        console.log(ypos);


        return [xpos, ypos, icon_height, transform];
    }


    return (
        <div id="killerGameWindow" className='screen'>
            <RoundCounter />

            <div id="scoringArea">
                <Board />
            </div>

            <div id='teamsIcons'>
                {teams.map((team, index) => {
                    
                    let [x, y, height, transform] = getTeamIconLocation(team);

                    return (
                        <div 
                            key={index}
                            className='team-icon'
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                height: `${height}`,
                                transform: transform
                            }}
                        >
                            <GamePlayerIcon 
                                team={team} 
                                activeTeam={activeTeam}/>
                        </div>
                    )
                })}
            </div>

            
            
        </div>
    );
}


/** BOARD COMPONENT
 * @component renders the dart board and team zones
 */
function Board() {
    const { teams } = useKiller();
    
    //Layout settings
    const boxDimensions = {
        width: 1000,
        height: 1000
    }

    return (
        <div id="killerBoard">
            
            {/*Killer scoring board*/}
            <svg viewBox="0 0 1000 1000" style={{"zIndex": "3"}}>
                {teams.map(((team, index) => {
                    return (
                        <TeamSegment 
                            key={index}
                            team={team} 
                            boxDimensions={boxDimensions}
                        />)
                }))}
            </svg>

            {/*Killer board background*/}
            <img src={KillerBoard} id="boardPNG"></img>
        </div>
    );
}


function TeamSegment({ team, boxDimensions }) {

    //Game Logic Imports
    const { dartAngles, activeTeam, updateTeamAttribute, teams } = useKiller();
    const { gameWindow, gameWindowDimensions } = useGameWindow();


    //Active/Inactive Properties
    const activeProps = {
        radialMultiplier: 1.1,
        style: {
            fill: `${Color(team.color).alpha(0.6)}`,
            stroke: `${team.color}`
        },
        outlineStyle: {
            fill: "none",
            strokeWidth: 10
        }
    }

    const inactiveProps = {
        radialMultiplier: 1,
        style: {
            fill: `${Color(team.color).alpha(0.1)}`,
            stroke: `${team.color}`
        },
        outlineStyle: {
            fill: "none",
        }
    }

    //Component states and fixed properties
    const [properties, setProperties] = useState(inactiveProps); //segment properties
    const radius = boxDimensions.width * 0.75 / 2; //radius of the segment


    const drawTeamSegment = (team, boxDimensions, properties) => {
        /**DRAW SEGMENT FUNCTION
         * @function drawTeamSegment draws a team segment on the board
         * @param {Object} team - Team object with data to be attached
         * @param {Object} boxDimensions - Dimensions of the board
         */

        //Segment Constants
        const segmentWidth = 17; //in degrees
        const orientation = 360 - dartAngles[team.board_number]; //Flip orientation to match SVG coordinate system
        const segmentDivisions = [0.5, 0.3, 0.2];
        
        
        const segmentLineAngle1 = orientation - segmentWidth / 2;
        const segmentLineAngle2 = orientation + segmentWidth / 2;
        const r = radius * properties.radialMultiplier;

        //Compute segment points
        var center = [boxDimensions.width / 2, boxDimensions.height / 2];

        //Segment properties
        var outline = {
            p1: center,
            p2: [
                center[0] + r*Math.cos(segmentLineAngle1 * Math.PI / 180),
                center[1] + r*Math.sin(segmentLineAngle1 * Math.PI / 180)
            ],
            p3: [
                center[0] + r*Math.cos(segmentLineAngle2 * Math.PI / 180),
                center[1] + r*Math.sin(segmentLineAngle2 * Math.PI / 180)
            ],
            id: `team${team.id}-segmentOutline`
        }
        
        var segment1 = {
            p1: center,
            p2: [
                center[0] + (r*segmentDivisions[0])*Math.cos(segmentLineAngle1 * Math.PI / 180),
                center[1] + (r*segmentDivisions[0])*Math.sin(segmentLineAngle1 * Math.PI / 180)
            ],
            p3: [
                center[0] + (r*segmentDivisions[0])*Math.cos(segmentLineAngle2 * Math.PI / 180),
                center[1] + (r*segmentDivisions[0])*Math.sin(segmentLineAngle2 * Math.PI / 180)
            ],
            id: `team${team.id}-segment1`
        }

        var segment2 = {
            p1: segment1.p2,
            p2: segment1.p3,
            p3: [
                segment1.p2[0] + (r*segmentDivisions[1])*Math.cos(segmentLineAngle1 * Math.PI / 180),
                segment1.p2[1] + (r*segmentDivisions[1])*Math.sin(segmentLineAngle1 * Math.PI / 180)
            ],
            p4: [
                segment1.p3[0] + (r*segmentDivisions[1])*Math.cos(segmentLineAngle2 * Math.PI / 180),
                segment1.p3[1] + (r*segmentDivisions[1])*Math.sin(segmentLineAngle2 * Math.PI / 180)
            ],
            id: `team${team.id}-segment2`
        }

        var segment3 = {
            p1: segment2.p3,
            p2: segment2.p4,
            p3: [
                segment2.p3[0] + (r*segmentDivisions[2])*Math.cos(segmentLineAngle1 * Math.PI / 180),
                segment2.p3[1] + (r*segmentDivisions[2])*Math.sin(segmentLineAngle1 * Math.PI / 180)
            ],
            p4: [
                segment2.p4[0] + (r*segmentDivisions[2])*Math.cos(segmentLineAngle2 * Math.PI / 180),
                segment2.p4[1]+ (r*segmentDivisions[2])*Math.sin(segmentLineAngle2 * Math.PI / 180)
            ],
            id: `team${team.id}-segment3`
        }

        var text = {
            x: center[0] + 1.11*r*Math.cos(orientation * Math.PI / 180),
            y: center[1] + 1.11*r*Math.sin(orientation * Math.PI / 180),
            id: `team${team.id}-text`
        }


        //Draw the segment paths
        var outlinePath = `
            M ${outline.p1[0]},${outline.p1[1]}
            L ${outline.p2[0]},${outline.p2[1]}
            A ${r},${r} 0 0,1 ${outline.p3[0]},${outline.p3[1]}
            z
        `;
        var path1 = `
            M ${segment1.p1[0]},${segment1.p1[1]}
            L ${segment1.p2[0]},${segment1.p2[1]}
            A ${r},${r} 0 0,1 ${segment1.p3[0]},${segment1.p3[1]}
            z
        `;
        var path2 = `
            M ${segment2.p1[0]},${segment2.p1[1]}
            L ${segment2.p3[0]},${segment2.p3[1]}
            A ${r},${r} 0 0,1 ${segment2.p4[0]},${segment2.p4[1]}
            L ${segment2.p2[0]},${segment2.p2[1]}

        `;
        var path3 = `
            M ${segment3.p1[0]},${segment3.p1[1]}
            L ${segment3.p3[0]},${segment3.p3[1]}
            A ${r},${r} 0 0,1 ${segment3.p4[0]},${segment3.p4[1]}
            L ${segment3.p2[0]},${segment3.p2[1]}
        `;


        //Render the segment
        return (<>
            {/*Outline*/}
            <path 
                d={outlinePath}
                className={'segment-outline'}
                id={`${outline.id}`}
                style={properties.outlineStyle}
            ></path>
            
            {/*Segment 1*/}
            <path 
                d={path1}
                className={'player-segment'}
                id={`${segment1.id}`}
                style={properties.style}
            ></path>

            {/*Segment 2*/}
            <path 
                d={path2}
                className={'player-segment'}
                id={`${segment2.id}`}
                style={properties.style}
            ></path>

            {/*Segment 3*/}
            <path 
                d={path3}
                className={'player-segment'}
                id={`${segment3.id}`}
                style={properties.style}
            ></path>

            <text
                x={text.x}
                y={text.y}
                className='team-text'
                id={`${text.id}`}
                style={{fill: `${team.color}`}}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {team.board_number}
            </text>
        </>)
    }

    //Handle Active
    useEffect(() => {
        if (activeTeam.id === team.id) {
            setProperties(activeProps);
        } else {
            setProperties(inactiveProps);
        }   
    }, [activeTeam]);

    //Update positions of team icons
    const getIconPosition = (element) => {
        if (!element) {
            console.error("Element not found");
            return;
        }

        const rect = element.getBoundingClientRect();

        // Areas
        let middle_left = [rect.left, rect.top + rect.height / 2];
        let middle_right = [rect.right, rect.top + rect.height / 2];
        

        let icon_location = [
            middle_left,
            middle_right
        ];

        return icon_location;
    }

    useLayoutEffect(() => {
        
        for (let team of teams) {
            let element = gameWindow.document.getElementById(`team${team.id}-text`);
            console.log("element", element);

            updateTeamAttribute(team, "team_icon_location", getIconPosition(element));
        }
    }, [gameWindowDimensions]);


    return drawTeamSegment(team, boxDimensions, properties);
}

/**ROUND COUNTER COMPONENT
 * @component renders the round counter*/
function RoundCounter() {

    // Game Logic Imports
    const { config, roundNumber } = useKiller();


    // Render a single round counter
    const renderRound = (round) => {
        return (
            <div 
                key={round} 
                className={roundNumber >= round ? 'round round-active' : 'round'}
            >
            </div>
        )
    }
    
    return (
        <div id="roundCounter">

            <h3>ROUND</h3>

            {/*Multiplier x1 Rounds*/}
            {Array.from({length: config.doublesRound - 1}, (_, i) => {
                let round = i + 1;
                return renderRound(round);
            })}
            
            
            {/*Multiplier x2 Rounds*/}
            <h4>-- x2 --</h4>
            {Array.from({length: config.triplesRound - config.doublesRound}, (_, i) => {
                let round = config.doublesRound + i;
                return renderRound(round);
            })}

            {/*Multiplier x3 Rounds*/}
            <h4>-- x3 --</h4>
            {Array.from({length: config.maxRounds - config.triplesRound + 1}, (_, i) => {
                let round = config.triplesRound + i;
                return renderRound(round);
            })}
            
        </div>
    )
}