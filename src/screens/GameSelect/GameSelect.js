/*
    SCREEN: Game Selection
    __App screen allowing users to select the game they want to play
*/
/*REACT IMPORTS*/
import React, { useEffect, useState } from "react";
import './GameSelect.css';
import app_logo from '../../assets/images/app_logo.png'; // App logo
import { useNavigate } from "react-router-dom";

import { useGames } from '../../contexts/GameContext'; // Game context

/*REACT COMPONENTS*/
import ActionButton from "../../components/ActionButton";

//Image/Icon Imports
import { GiDart, GiStarMedal,  } from "react-icons/gi";
import { GrSettingsOption } from "react-icons/gr";
import { GiExitDoor } from "react-icons/gi";





/*GAME SELECT MAIN COMPONENT
Main component that allows users to select a darts game*/
export default function GameSelect() {
    
    const { games } = useGames(); // Retrieve game data from context
    const [activeGame, setActiveGame] = useState(null); // State to store the active game

    // Handle background gradient
    const getBackground = () => {
        if (activeGame) {
            return `linear-gradient(180deg, ${activeGame.gradient.start} 0%, ${activeGame.gradient.end} 50%)`;
        } else {
            return "#3f3b2c"; //default background for no game selected
        }
    }


    useEffect(() => {
        if (games.length === 0) {return;} //skip useEffect if the games have not been loaded yet
        
        console.log(games);
    }, [games])

    useEffect(() => {
        console.log("Active Game", activeGame);
    }, [activeGame])
    

    return (
        <div id="GameSelect" style={{ background: getBackground() }}>
            <GamePreview activeGame={activeGame} /> {/*Preview, Instructions, etc.*/}
            <GameCarousel activeGame={activeGame} setActiveGame={setActiveGame}/> {/*"Choose Game" Carousel*/}
            <div id="CarouselBackground"></div> {/*Carousel Background*/}
        </div>
    );
}


/*GAME PREVIEW
Area to show game preview and how to play instructions*/
function GamePreview({ activeGame }) {
    return (
        <div id="GamePreview">
            
            {activeGame ? (
                
                <div id="PreviewArea">
                    <img className="game-logo" src={activeGame.logo}/>
                    
                    <h2>{activeGame.description}</h2>
                    
                    <div id="GameActions">
                        <ActionButton 
                            text="How to Play"
                            icon={"play"}
                            icon_size={"1.5em"}
                            action={() => {console.log("Playing!")}}/>
                        <ActionButton 
                            text="Select Game" 
                            icon={"target"}
                            icon_size={"1.5em"}
                            action={() => {}}/>
                    </div>
                </div>

            ) : (<GamePlaceholderMenu/>)}
        </div>
    );
}


/*GAME PLACEHOLDER MENU
Area to show placeholder and menu when a game is not selected*/
function GamePlaceholderMenu() {
    return (
        <div id="PreviewPlaceholder">
            <img id="appLogo" src={app_logo} alt="Darts Scorer Logo"/>

            <div id="placeholderMenu">
                <div className="placeholder-menu-column column1">
                    <MenuItem //Edit Players
                        icon={<GiDart size={"5em"} style={{"transform": "scaleX(-1)"}}/>} 
                        text={"Edit Players"}
                        route={"/player-config"}
                        orientation={"menu-item-left"}/>
                    <MenuItem //Settings
                        icon={<GrSettingsOption 
                                size={"4em"}
                                style={{"marginRight": "20px"}}/>}
                        text={"Settings"}
                        route={"/settings"}
                        orientation={"menu-item-right"}/>
                </div>
                <div className="placeholder-menu-column column2">
                    
                    <MenuItem //Leaderboard
                        icon={<GiStarMedal size={"5em"}/>}
                        text={"Leaderboard"}
                        route={"/leaderboard"}
                        orientation={"menu-item-left"}/>
                    <MenuItem //Exit
                        icon={<GiExitDoor size={"5em"}/>}
                        text={"Exit Game"}
                        route={"/"}
                        orientation={"menu-item-right"}/>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ icon, text, orientation, route }) {

    //Hooks
    const navigate = useNavigate();

    //Menu item options
    const icon_color = "#E4E0D7";


    const handleClick = () => {
        navigate(route);
    }


    return (
        <div className={`menu-item ${orientation}`} onClick={handleClick}>
            
            {
                orientation === "menu-item-left" ? (
                    <>
                        <h3 style={{"color": `${icon_color}`}}><em>{text}</em></h3>
                        {React.cloneElement(icon, {color: icon_color})}
                    </>
                ) : (
                    <>
                        {React.cloneElement(icon, {color: icon_color})}
                        <h3 style={{"color": `${icon_color}`}}><em>{text}</em></h3>
                    </>
                )
            }

        </div>
    );
}


/*GAME CAROUSEL
Carousel for selecting what game to play*/
function GameCarousel({ activeGame, setActiveGame }) {
//Game carousel will retrieve games and instantiate game icons for each game

    //Retrieve and collect game data
    const { games } = useGames();

    return (
        <div id="GameCarousel">
            {games.map((game, index) => {
                return <GameIcon key={index} 
                            game={game}
                            icon={game.icon}
                            isActive={activeGame == game}
                            setActiveGame={setActiveGame}/>
            })}
        </div>
    );
}


/*GAME ICON
Game icons*/
function GameIcon(props) {
    // Change class based on active state
    const icon_class = props.isActive ? "game-icon game-icon-hover game-icon-active" : "game-icon game-icon-hover";

    const changeActiveGame = (e) => {
        if (props.isActive) {
            props.setActiveGame(null);
        } else {
            props.setActiveGame(props.game);
        }
    }
    
    return (
        <div className={icon_class} onClick={changeActiveGame}>
            <img src={props.icon} alt="Description of image"/>
        </div>
    );
}
