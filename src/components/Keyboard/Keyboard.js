
/** COMPONENT: KEYBOARD
 * @component Keyboard for data entry within the UI
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './Keyboard.css';


export default function Keyboard({ submitter }) {
    const [input, setInput] = useState("");

    
    //Modify input
    const handleKeyClick = (char) => {

        //Handle special cases
        switch (char) {
            case "DEL":
                setInput(input.slice(0, -1));
                return;
            case "SPACE":
                setInput(input + " ");
                return;
            case "ENTER":
                setSubmit(true);
                submitter(input);
                return;
            case "CAPS":
                console.log("CAPS set");
                return;
        }

        //Handle character input
        setInput(input + char);
    }
    
    return (
        <li id="keyboard">
            {input}
            <ul className='keyboard-row'>
                <CharRow chars='1234567890' keyClick={handleKeyClick}/>
                <SpecialKey 
                    text='back' 
                    action='DEL' 
                    keyClick={handleKeyClick}
                />
            </ul>
            <ul className='keyboard-row'>
                <CharRow chars='QWERTYUIOP' keyClick={handleKeyClick}/>
            </ul>
            <ul className='keyboard-row'>
                <SpecialKey 
                    text='caps lock' 
                    action='CAPS' 
                    keyClick={handleKeyClick}
                />
                <CharRow chars='ASDFGHJKL' keyClick={handleKeyClick}/>
                <SpecialKey 
                    text='enter' 
                    action='ENTER' 
                    keyClick={handleKeyClick}
                />
            </ul>
            <ul className='keyboard-row'>
                <CharRow chars='ZXCVBNM' keyClick={handleKeyClick}/>
            </ul>
            <ul className='keyboard-row'>
                <SpecialKey 
                    text='' 
                    action='SPACE' 
                    keyClick={handleKeyClick}
                />
            </ul>
        </li>
    );
}

function CharRow({ chars, keyClick }) {
    return (
        <>{chars.split('').map((char, index) => (
                <Key key={index} char={char} keyClick={keyClick}/>
            ))
        }</>
    );
}

function Key({ char, keyClick }) {
    return (
        <div className='keyboard-key char-key' onClick={() => keyClick(char)}>
            <p>{char}</p>
        </div>
    );
}

function SpecialKey({ text, action, keyClick }) {
    const [classType, setClassType] = useState('');

    //set the class type
    useEffect(() => {
        switch (action) {
            case "DEL":
                setClassType('backspace');
                break;
            case "SPACE":
                setClassType('space');
                break;
            case "ENTER":
                setClassType('enter');
                break;
            case "CAPS":
                setClassType('caps');
                break;
        }
    }, [])
    
    return (
        <div className={`keyboard-key special-key ${classType}`} onClick={() => keyClick(action)}>
            <p>{text}</p>
        </div>
    );
}

