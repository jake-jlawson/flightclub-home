/*
    COMPONENT: Action Button
    __Buttons for app actions
*/
/*REACT IMPORTS*/
import React, { useEffect, useState } from "react";
import './ActionButton.css';

// icons imports
import { TbTargetArrow } from "react-icons/tb";
import { IoPlayCircleOutline } from "react-icons/io5";



/*ACTION BUTTON COMPONENT*/
export default function ActionButton({ text, icon, action, icon_size }) {
    
    // icons list
    const icons = {
        "target": <TbTargetArrow size={icon_size}/>,
        "play": <IoPlayCircleOutline size={icon_size}/>
    }
    
    return (
        <button className="action-buttons" onClick={action}>
            {icons[icon]}
            {text}
        </button>
    )
}