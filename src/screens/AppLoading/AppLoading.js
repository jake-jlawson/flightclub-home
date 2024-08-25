
/** SCREEN: LOADING SCREEN
 * @screen File serves the player loading screen
 * - Wait on a particular variable or set of variables.
 * - Display loading screen until variables have been found.
 * - Remove loading screen and render variable once found
*/
/*Imports*/
import React, { useEffect, useState } from 'react';
import './AppLoading.css';


// Function to check whether waitOn variables exist or not
export function isLoading(waitOn) {

    console.log(waitOn);

    if (!Array.isArray(waitOn)) {
        console.error("'waitOn' must recieve an array!");
    }

    const allPopulated = waitOn.every(
        wait_var => (wait_var !== null) && wait_var !== undefined
    ); //check if every waitOn variable is populated

    console.log(allPopulated);

    return allPopulated;
}


export function LoadingScreen() {

    return (
        <div id="loadingScreen">
            <p>Loading...</p>
        </div>
    )
}