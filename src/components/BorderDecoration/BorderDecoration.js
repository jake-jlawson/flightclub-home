
/** COMPONENT: BORDER DECORATION
 * @component Decorative border element for different games and screens
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './BorderDecoration.css';


export default function BorderDecoration({ logo }) {
    const [logos, setLogos] = useState(false);

    useEffect(() => {
        if (logo) {
            setLogos(true);
        } else {
            setLogos(false);
        }
    }, [logo])
    

    return (
        <div id="borderDecoration">
            
            <div 
                id="flightClubTag" 
                className={`border-tag ${!logos ? 'hidden' : ''}`}></div>
            
            <div id="borderOuter">
                <div id="borderInner"></div>
            </div>

            <div 
                id="gameTag" 
                className={`border-tag ${!logos ? 'hidden' : ''}`}></div>
        </div>
    )
}