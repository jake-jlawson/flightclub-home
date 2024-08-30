
/** COMPONENT: GAME PLAYER ICON
 * @component Icon to display players in the UI during games
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './GamePlayerIcon.css';

import DartButton from '../DartButton/DartButton';


export default function GamePlayerIcon({ team, activeTeam, alwaysDisplayNames }) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (team.id && activeTeam.id && (team.id === activeTeam.id)) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [activeTeam]);


    return (
        <div className='game-player-icon'>
            <div 
                className='throw-counter'
                style={{display: active ? 'flex' : 'none'}}
            ></div>
            
            {
                team.players.map((player, index) => {
                    
                    let animate = false;

                    if (team.activePlayer === player && active) {
                        animate = true;
                    }

                    return (
                        <PlayerIcon 
                            player={player} 
                            key={index} 
                            border_color={team.color}
                            active={active}
                            animate={animate}
                            namesAlwaysActive={alwaysDisplayNames}
                        />
                    )
                })
            }
                
            <div 
                className='throw-counter' 
                style={{display: active ? 'flex' : 'none'}}
            >
                <DartButton
                    orientation="left"
                    color="white"
                    action={() => {}}
                    unchecked={true}>
                        <div className='dart-spacer'></div>
                </DartButton>
                <DartButton
                    orientation="left"
                    color="white"
                    action={() => {}}
                    unchecked={true}>
                        <div className='dart-spacer'></div>
                </DartButton>
                <DartButton
                    orientation="left"
                    color="white"
                    action={() => {}}
                    unchecked={true}>
                        <div className='dart-spacer'></div>
                </DartButton>
            </div>
        </div>
    )
}

function PlayerIcon({ player, border_color, namesAlwaysActive, animate }) {
    const [showName, setShowName] = useState(false);

    useEffect(() => {
        if (namesAlwaysActive) {
            setShowName(true);
        } else {
            setShowName(animate);
        }
    }, [namesAlwaysActive, animate]);
    
    
    return (
        <div className='team-player-icon'>
            <div className='border-animation'
                style={{display: animate ? 'block' : 'none'}}></div>
            <img 
                src={player.img} 
                alt={player.name} 
                style={{borderColor: border_color}}
            />
            <p style={{display: (showName) ? 'block' : 'none'}}>
                {player.name}
            </p>
        </div>
    )
}