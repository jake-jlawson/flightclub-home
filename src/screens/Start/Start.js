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
import { useGameWindow } from '../../contexts/GameDisplay'



export default function Start() {

    const { openGameWindow } = useGameWindow();
    const [message, setMessage] = useState("It finally works!");


    const changeMessage = () => {
        setMessage("Hello World");
    }


    return (
        <div id="Start">
            <h1>Start Screen</h1>
            <button onClick={openGameWindow}>Start Game</button>
            <button onClick={changeMessage}>Change Message</button>

            <GameDisplay>
                <h1 id="msg">{message}</h1>
            </GameDisplay>
        </div>
    );
}