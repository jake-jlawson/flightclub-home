
/** COMPONENT: BORDER DECORATION
 * @component Decorative border element for different games and screens
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './BorderDecoration.css';

//Image/Icon Imports
import flightclublogo from '../../assets/images/flightclub_logo.png';


export default function BorderDecoration({ fc_logo, game_logo }) {
    const [showFCLogo, setShowFCLogo] = useState(false);
    const [showGameLogo, setShowGameLogo] = useState(false);


    useEffect(() => {
        
        console.log(fc_logo, game_logo);

        //set flightclub logo if true
        if (fc_logo) { setShowFCLogo(true); }

        //set game logo if provided
        if (game_logo) { setShowGameLogo(true); }
        
    }, [fc_logo, game_logo])

    useEffect(() => {
        console.log('showFCLogo:', showFCLogo);
        console.log('showGameLogo:', showGameLogo);
    }, [showFCLogo, showGameLogo])
    

    return (
        <div className="borderDecoration">
            
            <div 
                className={`flightClubTag border-tag ${!showFCLogo ? 'hidden' : ''}`}>
                <img src={flightclublogo} alt="Flight Club Logo" className='flight-club-logo'/>
            </div>
            
            <div id="borderOuter">
                <div id="borderInner"></div>
            </div>

            <div 
                className={`gameTag border-tag ${!showGameLogo ? 'hidden' : ''}`}>
                
                {
                    showGameLogo ? (
                        <img src={game_logo} alt="Game Logo" className='decoration-game-logo'/>
                    ) : null
                }

            </div>
        </div>
    )
}