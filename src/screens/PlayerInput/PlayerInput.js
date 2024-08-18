
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






export default function PlayerInput() {
    const [currentInput, setCurrentInput] = useState("");


    const addNewPlayer = (input) => {
        console.log("Adding new player: ", input);
    }


    return (
        <div id="playerInput">
            <form id="inputForm">
                <input 
                    type="text" 
                    id="inputField"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                ></input>
            </form>
            <Keyboard 
                submitter={addNewPlayer} 
                inputCapture={setCurrentInput}
            />
        </div>
    );
}
