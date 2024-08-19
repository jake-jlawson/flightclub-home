
/** COMPONENT: DART BUTTON
 * @component Stylized dart button
*/

/*Imports*/
import React from 'react';
import './DartButton.css';


/** COMPONENT DEFINITION */
export default function DartButton({ children, orientation, color, action }) {
    
    /**PROPS DEFINITIONS
     * @prop {JSX} renderInside - JSX to render inside the button
     * @prop {string} orientation - Orientation of the button, where the dart would be pointing (down, up, left, right)
     * @prop {string} color - Color of the button (red, grey, green)
     * @prop {function} action - Action to perform when button is clicked
     */

    const colorTable = { //default dart button colours
        red: "#E8344F",
        grey: "#727d8c",
        green: "#0cc474"
    }

    const rotationTable = {
        down: '90deg',
        up: '-90deg',
        left: '180deg',
        right: '0deg'
    }
    
    
    
    
    return (
        
        <button id="dartButton">
            <svg
                id="dartSVG"
                data-name="Layer 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 370.36 292.03"
                fill={colorTable[color]}
                style={{"transform": `rotate(${rotationTable[orientation]})`}}
            >
                <path 
                    d="M569,255.92h-.19L478,356.51A138,138,0,0,1,375.6,402l-73.3,0a22.48,22.48,0,0,1-19.05-10.5q-41.64-66-83.3-132a5.16,5.16,0,0,1,.17-7.07c28-43.8,56-87.64,83.19-131.9A22.57,22.57,0,0,1,302.37,110l73.29,0a138,138,0,0,1,102.39,45.41Z"
                    transform="translate(-198.64 -110)" 
                />
            </svg>

            <div className="dart-button-child">{children}</div>
        </button>
        
        
    );
}