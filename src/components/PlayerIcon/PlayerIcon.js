
/** COMPONENT: PLAYER ICON
 * @component Icon to display players in the UI
*/

/*Imports*/
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PlayerIcon.css';

//Image/Icon Imports
import some_pic from '../../assets/images/blank_profile_pic.png';
import jakepic from '../../assets/images/jakepic.png'; // Profile Pic
import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";




//Context imports
import { usePlayers } from '../../contexts/PlayerContext';


/** COMPONENT DEFINITION */
export default function PlayerIcon({ player, edit, add, remove }) {
    
    /**PROPS DEFINITIONS
     * @prop {Player} player - Object containing all player information, null if icon will be used for adding a player
     * @prop {Boolean} edit - Include a player edit icon
     */
    
    const [playerName, setPlayerName] = useState("");
    const [playerImg, setPlayerImg] = useState();
    const [iconClass, setIconClass] = useState("player-icon");

    //Hooks
    const navigate = useNavigate();
    const { removePlayer } = usePlayers();



    // Handle different player icon types
    useEffect(() => {

        //no player and no add
        if (add) {
            setPlayerName("Add");
            setIconClass("add-player-icon");
        } else if (!player) {
            setPlayerName("");
            setIconClass("blank-player-icon");
        } else {
            setPlayerName(player.name);
            setPlayerImg(player.img);
            setIconClass("active-player-icon");
        }

    }, [player])


    // Handle icon handles
    const iconHandle = (icon) => {

        if (icon === "edit" && edit) {
            return (
                <div className="handle edit"
                    onClick={() => {
                        removePlayer(player.id);
                        navigate("/player-input");
                    }}
                >
                    <MdOutlineEdit size={"1.3em"} color='white'/>
                </div>
            )
        }

        if (icon === "remove" && remove) {
            return (
                <div className="handle remove"
                    onClick={() => {removePlayer(player.id)}}
                >
                    <FaTrash size={"1em"} color='white'/>
                </div>
            )
        }

        return;
    }


    return (
        <div className={"player-icon"}>

            {iconHandle("edit")}
            {iconHandle("remove")}

            {
                add ?
                //add icon (links to player input)
                <div className={`player-img ${iconClass}`}
                    onClick={() => navigate("/player-input")}
                >
                    <FiPlus size={"5em"} color='white'/>
                </div>
                :
                //normal player icon
                <div className={`player-img ${iconClass}`}>
                    <img src={playerImg}></img>
                </div>
            }

            <p>{playerName}</p>
        </div>
    )
}