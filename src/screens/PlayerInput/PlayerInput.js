
/** SCREEN: PLAYER INPUT
 * @screen File serves the player input screen
 * - Provides interface for player input
 * - Provides logic for player input
*/

/*Imports*/
import React, { useState } from 'react';
import './PlayerInput.css';

//Component Imports
import Keyboard from '../../components/Keyboard/Keyboard';






export default function PlayerInput() {

    const addNewPlayer = (input) => {
        console.log("Adding new player: ", input);
    }



    return (
        <div id="playerInput">
            <Keyboard submitter={addNewPlayer}/>
        </div>
    );
}
