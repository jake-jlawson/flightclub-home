
/** SCREEN: PLAYER CONFIG
 * @screen File serves the player configuration screen
 * - View current players
 * - Add new players
 * - Remove players
 * - View Leaderboard
*/

/*Imports*/
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerConfig.css';

//Context Imports
import { usePlayers, Player } from '../../contexts/PlayerContext';

//Component Imports
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';
import PlayerIcon from '../../components/PlayerIcon/PlayerIcon';
import DartButton from '../../components/DartButton/DartButton';

//Icons/Images Imports
import jakepic from '../../assets/images/jakepic.png'; // Profile Pic


/** PLAYER CONFIG SCREEN MAIN COMPONENT */
export default function PlayerConfig() {

    //Player Context
    const { players } = usePlayers();

    //Hooks
    const navigate = useNavigate();
    
    
    
    
    
    return (
        <div id="playerConfig">

            <BorderDecoration />


            <div id="playerControlTop"></div>

            <div id="playerEntry">
                <div id="playerList">
                    
                    {/*Player Icons*/
                    players.map((item, index) => {
                        return <PlayerIcon 
                                    player={item} 
                                    key={index} 
                                    remove={true}/>
                    })}

                    {/*Player add icon*/}
                    <PlayerIcon add={true}/>

                    {/*Empty Icon Spaces*/
                    Array.from({length: 11 - players.length}).map((item, index) => {
                        return <PlayerIcon key={index}/>
                    })}

                </div>
            </div>

            <div id="playerControlBottom">
                <DartButton 
                    orientation="right"
                    color="green"
                    action={() => navigate("/game-select")}
                >
                    <p>PLAY</p>
                </DartButton>
            </div>
        </div>
    )
}

