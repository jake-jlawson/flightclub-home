/** GAME SCREEN: Donkey Derby
 * @fileoverview File serves the donkey derby game screen
 * - Responsible for all primary animations
 * - Displays the game screen, darts feedback and scores feedback
*/
/*IMPORTS*/
import React, { useEffect, useState, useRef } from 'react';
import './GameScreen.css';

//Context Imports
import { useDonkeyDerby } from '../GameLogic';

//Component Imports
import GamePlayerIcon from '../../../components/GamePlayerIcon/GamePlayerIcon';

//Image/Icon Imports
import FinishLine from './assets/FinishLine.png';


/** GAME SCREEN COMPONENT*/
export default function GameScreen() {
    
    const { teams } = useDonkeyDerby();

    return (
        <div id="ddGameScreen" className='screen'>
            
            {/*Round Counter*/}
            <RoundCounter/>
            

            <div id="teamPlayZone">
                {teams.map((team, index) => {
                    return <TeamPlayZone 
                                team={team} 
                                key={index}
                                height={`${100 / 6}%`}
                            />
                })}
            </div>


            <div id="finishLine">
                <img src={FinishLine} alt="Finish Line" />
            </div>
        </div>
    );
}


/**TEAM PLAY ZONE
 * @description areas where players see their progress summarised
*/
function TeamPlayZone({ team, height }) {
    
    const { activeTeam } = useDonkeyDerby();

    return (
        <div className="team-zone" style={{height: height, maxHeight: height}}>
            <div className="dd-team-icon">
                <GamePlayerIcon 
                    team={team}
                    activeTeam={activeTeam}
                    alwaysDisplayNames={true}
                />
            </div>
            <div className="donkey-run">
                <DonkeyTrack currentScore={1} team={team}/>
            </div>
        </div>
    )
}


/**DONKEY TRACK
 * @description areas where players donkeys run
*/
function DonkeyTrack({ team, currentScore }) {
    const { config, activeTeam, teams, currentGoScore } = useDonkeyDerby();
    const [active, setActive] = useState(false);
    const [position, setPosition] = useState(0);

    // Donkey Track Settings
    const trackSettings = {
        color: 'black',
        stroke: 2,
        ticks: Array.from({ length: config.pointsToWin + 1 }, (_, i) => i),
        numberOfTicks: config.pointsToWin,
        start: 6.75,
        donkeyWidth: 12
    }

    //Styles
    const getTrackStyle = (active) => {
        if (active) {
            return { //active styles
                stroke: team.color,
                strokeWidth: trackSettings.stroke * 2,
            }
        } else {
            return { //inactive styles
                stroke: trackSettings.color,
                strokeWidth: trackSettings.stroke,
            }
        }
    }

    useEffect(() => {
        if (team.id && activeTeam.id && (team.id === activeTeam.id)) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [team, activeTeam]);

    useEffect(() => {
        setPosition(getPosition(team.points + currentGoScore[0] + currentGoScore[1] + currentGoScore[2]));
    }, [teams, currentGoScore])



    // Calculate point widths
    const svgRef = useRef(null);
    const getPosition = (points) => {
        
        if (!svgRef.current) {
            return 0;
        }

        const svg_dimensions = svgRef.current.getBBox();
        const width = svg_dimensions.width;

        return points * (width / config.pointsToWin);
    }


    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 100% 100%`}
            style={{ width: '100%', height: '100%'}}
            className='donkey-track'
            ref={svgRef}
        >

            {/*Axis*/}
            <line 
                x1={`${trackSettings.donkeyWidth / 2}%`} y1="95%" x2="100%" y2="95%"
                style={getTrackStyle(active)}
            />

            {/*Ticks*/}
            {trackSettings.ticks.map((tick, index) => {
                return (
                    <line 
                        x1={`${(trackSettings.donkeyWidth / 2) + ((100 - (trackSettings.donkeyWidth / 2)) / (trackSettings.numberOfTicks)) * tick}%`} 
                        y1="95%" 
                        x2={`${(trackSettings.donkeyWidth / 2) + ((100 - (trackSettings.donkeyWidth / 2)) / (trackSettings.numberOfTicks)) * tick}%`} 
                        y2="100%" 
                        style={getTrackStyle(active)}
                        key={index}
                    />
                )
            })}

            {/*Render Donkey
                (INSERT GROUP ELEMENT FOR DONKEY AND TEXT)*/}
            <g 
                width={`${trackSettings.donkeyWidth}%`}
                transform={`translate(${position}, 0)`}
            >
                <image 
                    href={team.donkey} 
                    x="0"
                    y="0" 
                    width={`${trackSettings.donkeyWidth}%`}
                    preserveAspectRatio="xMidYMid meet"
                />

                <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="78"
                    y="60"
                >
                    {team.board_number}
                </text>
            </g>
            
        </svg>
    )
}


/**ROUND COUNTER
 * @description visualises the current round count
*/
function RoundCounter() {
    
    const { roundNumber, config } = useDonkeyDerby();
    
    const renderRoundCounter = (round) => {
        return (
            <div 
                className={roundNumber >= round ? 'dd-round dd-round-active' : 'dd-round'}
                key={round}
            ></div>
        )
    }
    
    return (
        <div id="ddRoundCounter">
            {Array.from({length: config.maxRounds}, (_, i) => i).map((_, index) => {
                let round = index + 1;
                return renderRoundCounter(round);
            })}
        </div>
    )
}