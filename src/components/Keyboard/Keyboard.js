
/** COMPONENT: KEYBOARD
 * @component Keyboard for data entry within the UI
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './Keyboard.css';


export default function Keyboard({ inputCapture, submitter }) {
    const [input, setInput] = useState("");
    const [caps, setCaps] = useState(true);

    
    //Modify input
    const handleKeyClick = (char, e) => {

        if (e) { //prevent transfer of focus
            e.preventDefault();
            e.stopPropagation();
        }

        //Handle special cases
        switch (char) {
            case "DEL":
                setInput(input.slice(0, -1));
                return;
            case "SPACE":
                setInput(input + " ");
                return;
            case "ENTER":
                submitter(input);
                setInput("");
                return;
            case "CAPS":
                setCaps(!caps);
                return;
        }

        //Handle character input
        setInput(input + char);

        if (caps) { //reset caps
            setCaps(false);
        };
    }

    //Capture keydown events
    const handleKeyDown = (e) => {
        
        //get the key pressed
        let key;
        if (e.key === " ") {
            key = "Space";
        } else if (/\d/.test(e.key)) {
            key = `n${e.key}`;
        } else if (e.key.length < 2) {
            key = e.key.toUpperCase();
        } else {
            key = e.key;
        }

        let element = document.querySelector(`.${key}`); //find that key on the keyboard

        if (element) {
            // element.click(); //simulate a click

            let click_event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            element.dispatchEvent(click_event);

        } else {
            console.log(`No element found with class name: ${key}`);
        }
    }

    //Keep input in sync
    useEffect(() => {
        inputCapture(input);
    }, [input])


    //Add event listeners
    useEffect(() => {
        document.querySelector('.non-focusable').addEventListener('mousedown', function(event) {
            event.preventDefault();
        });

        document.addEventListener('keydown', function(event) {
            handleKeyDown(event);
        });
    }, [])
    

    return (
        <li id="keyboard" className='non-focusable'>
            <ul id="numberRow" className='keyboard-row'>
                <CharRow 
                    chars='1234567890' 
                    keyClick={handleKeyClick} 
                    caps={caps}/>
                <SpecialKey 
                    text='back' 
                    action='DEL' 
                    keyClick={handleKeyClick}
                />
            </ul>
            <ul className='keyboard-row'>
                <CharRow chars='QWERTYUIOP' keyClick={handleKeyClick} caps={caps}/>
            </ul>
            <ul className='keyboard-row'>
                <SpecialKey 
                    text='caps lock' 
                    action='CAPS' 
                    keyClick={handleKeyClick}
                />
                <CharRow chars='ASDFGHJKL' keyClick={handleKeyClick} caps={caps}/>
                <SpecialKey 
                    text='enter' 
                    action='ENTER' 
                    keyClick={handleKeyClick}
                />
            </ul>
            <ul className='keyboard-row'>
                <CharRow chars='ZXCVBNM_' keyClick={handleKeyClick} caps={caps}/>
            </ul>
            <ul id="spacebarRow" className='keyboard-row'>
                <SpecialKey 
                    text='' 
                    action='SPACE' 
                    keyClick={handleKeyClick}
                />
            </ul>
        </li>
    );
}

function CharRow({ chars, keyClick, caps }) {
    return (
        <>{chars.split('').map((char, index) => (
                <Key key={index} char={char} keyClick={keyClick} caps={caps}/>
            ))
        }</>
    );
}

function Key({ char, keyClick, caps }) {
    const [character, setCharacter] = useState(char);

    useEffect(() => {
        switch (caps) {
            case true:
                setCharacter(char.toUpperCase());
                break;
            case false:
                setCharacter(char.toLowerCase());
                break;
        }
    }, [caps])


    const getClassName = (char) => {
        if (/\d/.test(char)) {
            return `n${char}`;
        }

        return char.toUpperCase();
    }

    return (
        <div 
            className={`keyboard-key char-key ${getClassName(character)}`}
            onClick={() => keyClick(character)}
            onKeyDown={(e) => {handleKeyDown(e)}}>
            <p>{character}</p>
        </div>
    );
}

function SpecialKey({ text, action, keyClick }) {
    const [classType, setClassType] = useState('');

    //set the class type
    useEffect(() => {
        switch (action) {
            case "DEL":
                setClassType('Backspace');
                break;
            case "SPACE":
                setClassType('Space');
                break;
            case "ENTER":
                setClassType('Enter');
                break;
            case "CAPS":
                setClassType('CapsLock');
                break;
        }
    }, [])
    
    return (
        <div className={`keyboard-key special-key ${classType}`} onClick={() => keyClick(action)}>
            <p>{text}</p>
        </div>
    );
}

