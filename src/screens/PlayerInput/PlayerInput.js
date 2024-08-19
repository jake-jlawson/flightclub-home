
/** SCREEN: PLAYER INPUT
 * @screen File serves the player input screen
 * - Provides interface for player input
 * - Provides logic for player input
*/

/*Imports*/
import React, { useState, useRef } from 'react';
import './PlayerInput.css';

//Component Imports
import Keyboard from '../../components/Keyboard/Keyboard';
import DartButton from '../../components/DartButton/DartButton';
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';

//Icons/Images Imports
import { IoCheckmarkOutline } from "react-icons/io5";
import profile_pic from '../../assets/images/blank_profile_pic.png'; // Profile Pic









export default function PlayerInput() {
    const [currentInput, setCurrentInput] = useState("");


    const addNewPlayer = (input) => {
        console.log("Adding new player: ", input);
    }


    return (
        <div id="playerInput">
            
            <BorderDecoration/>

            <div id="playerNameField">
                <h3 id="nameFieldTag">Player's Name:</h3>

                <form id="inputForm">
                    <input 
                        type="text" 
                        id="inputField"
                        value={currentInput}
                        placeholder='TYPE NAME'
                        onChange={(e) => setCurrentInput(e.target.value)}
                    ></input>

                    <img className="player-pic" src={profile_pic}></img>
                
                    <DartButton 
                        orientation={90}
                        color={"grey"}
                        action={1}>
                            <div id="checkIcon">
                                <IoCheckmarkOutline size={"4.5em"} color='white'/>
                            </div>
                    </DartButton>
                    
                </form>
            </div>
            
            <div id="backButton">
                <DartButton 
                    orientation={"left"}
                    color={"red"}
                    action={1}
                />
                    <p></p>
                <DartButton />
            </div>
            
            
            
            
            
            
            
            
            
            
            <Keyboard 
                submitter={addNewPlayer} 
                inputCapture={setCurrentInput}
            />
        </div>
    );
}
