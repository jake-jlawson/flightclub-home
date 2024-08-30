/** GAME SCREEN: Donkey Derby
 * @fileoverview File serves the donkey derby game screen
 * - Responsible for all primary animations
 * - Displays the game screen, darts feedback and scores feedback
*/
/*IMPORTS*/
import React, { useEffect, useState } from 'react';
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
                            height={`${100 / (teams.length)}%`}
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
    const { config, activeTeam } = useDonkeyDerby();
    const [active, setActive] = useState(false);

    // Donkey Track Settings
    const trackSettings = {
        color: 'black',
        stroke: 2,
        ticks: Array.from({ length: config.pointsToWin + 1 }, (_, i) => i),
        numberOfTicks: config.pointsToWin,
        start: 6.75
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
    
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 100% 100%`}
            style={{ width: '100%', height: '100%' }}
            className='donkey-track'
        >

            {/*Axis*/}
            <line 
                x1={`${trackSettings.start}%`} y1="95%" x2="100%" y2="95%" 
                style={getTrackStyle(active)}
            />

            {/*Ticks*/}
            {trackSettings.ticks.map((tick, index) => {
                return (
                    <line 
                        x1={`${trackSettings.start + ((100-trackSettings.start) / (trackSettings.numberOfTicks)) * tick}%`} 
                        y1="95%" 
                        x2={`${trackSettings.start + ((100-trackSettings.start) / (trackSettings.numberOfTicks)) * tick}%`} 
                        y2="100%" 
                        style={getTrackStyle(active)}
                        key={index}
                    />
                )
            })}

            {/*Render Donkey
                (INSERT GROUP ELEMENT FOR DONKEY AND TEXT)*/}
            <image 
                href={team.donkey} 
                x={`${team.points / config.pointsToWin * 100}%`} 
                y="80%" 
                height="80%" 
                preserveAspectRatio="xMidYMid meet"
                transform='translate(0, -102)'
            />

            <text
                textAnchor="middle"
                dominantBaseline="middle"
                x={`${team.points / config.pointsToWin * 100}%`}
                y="50%"
            >
                {team.board_number}
            </text>
        </svg>
    )
}


/**ROUND COUNTER
 * @description visualises the current round count
*/
function RoundCounter() {
    return (
        <div id="ddRoundCounter"></div>
    )
}