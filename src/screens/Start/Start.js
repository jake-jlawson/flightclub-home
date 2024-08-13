/*
    SCREEN: Game Start
    __App starting screen
*/
/*REACT IMPORTS*/
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './Start.css';

import { Link } from 'react-router-dom';


import { GameDisplay } from '../../contexts/GameDisplay';



export default function Start() {
    
    const openWindow = () => {
        window.gameScreen.open();
    }

    return (
        <div id="Start">
            <h1>Start Screen</h1>
            <button onClick={openWindow}>Start Game</button>

            <GameDisplay>
                <h1>This is the Game Display</h1>
            </GameDisplay>
        </div>
    );
}