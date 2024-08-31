
/** COMPONENT: SCORE ENTRY
 * @component Component for manually entering scores or editing the scores in games
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import './ScoreEntry.css';

//Component Imports
import DartButton from '../DartButton/DartButton';


/** SCORE ENTRY COMPONENT */
export default function ScoreEntry({ scoreHandler }) {
    const throwsPerRound = 3;
    
    return (
        <div id="scoreEntry">
            {Array.from({length: throwsPerRound}, (v, i) => i).map((throwNum) => {
                return <ThrowInput key={throwNum} throwNumber={throwNum + 1} scoreHandler={scoreHandler}/>
            })}
        </div>
    )
}

function ThrowInput({ throwNumber, scoreHandler }) {
    return (
        <DartButton orientation={"down"} color={"white"} unchecked={true}>
            <div className='throw-input'>
                
                <div className='throw-select'>
                    <select name="score" className="throw-score">
                        <option key={0} value={0}>{0}</option>
                        {Array.from({length: 20}, (v, i) => i).map((score) => {
                            return <option key={score + 1} value={score + 1}>{score + 1}</option>
                        })}
                        <option key={25} value={"B"}>{"B"}</option>
                        <option key={50} value={"BB"}>{"BB"}</option>
                    </select>
                </div>
                
                <MultiplierConfig/>
                
            </div> 
        </DartButton>
    )
}

function MultiplierConfig() {
    const [multiplier, setMultiplier] = useState('single');

    //Set up multipliers
    const multipliers_list = [
        {label: 'S', value: 'single'},
        {label: 'D', value: 'double'},
        {label: 'T', value: 'triple'}
    ]
    
    return (
        <div className='multiplier-config'>
            {multipliers_list.map((m) => {
                return (
                    <div
                        key={m.value}
                        className={`multiplier ${m.value} ${m.value === multiplier ? 'selected' : ''}`}
                        onClick={() => setMultiplier(m.value)}
                    >
                        <p>{m.label}</p>
                    </div>
                )
            })}
        </div>
    )
}