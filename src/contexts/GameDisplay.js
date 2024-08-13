
/** CONTEXT: GAME DISPLAY
 * @fileoverview File serves supports the display of content on the game display screen
 * - Provides a portal component for rendering content on the game display screen
*/

/*Imports*/
import React, { useEffect, useState } from 'react';


/** GAME DISPLAY COMPONENT
 * @component provides a component for wrapping content that needs to be displayed in the game window*/
export function GameDisplay({ children }) {
    
    useEffect(() => {
        console.log(children);
    }, []);

    return null; //does not physically render anything in its location
}