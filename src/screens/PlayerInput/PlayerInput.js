
/** SCREEN: PLAYER INPUT
 * @screen File serves the player input screen
 * - Provides interface for player input
 * - Provides logic for player input
*/

/*Imports*/
import React, { useState, useEffect, useRef } from 'react';
import './PlayerInput.css';

//Component Imports
import Keyboard from '../../components/Keyboard/Keyboard';
import DartButton from '../../components/DartButton/DartButton';
import BorderDecoration from '../../components/BorderDecoration/BorderDecoration';
import ActionButton from '../../components/ActionButton';

//Context Imports
import { usePlayers } from '../../contexts/PlayerContext';

//Icons/Images Imports
import { IoCheckmarkOutline } from "react-icons/io5";
import profile_pic from '../../assets/images/blank_profile_pic.png'; // Profile Pic



export default function PlayerInput() {
    
    // States for keeping track of player data entry
    const [playerName, setPlayerName] = useState("");

    // UI States
    const [photoCapture, setPhotoCapture] = useState(false);

    const toggleCaptureWindow = () => {
        setPhotoCapture(!photoCapture);
    }
    
    



    const addNewPlayer = (input) => {
        setPhotoCapture(true);
        console.log("Adding new player: ", input);
    }

    

    


    return (
        <div id="playerInput">
            
            <BorderDecoration/>
            
            {photoCapture ? 
                <PhotoCapture 
                    toggleCapture={toggleCaptureWindow}
                    playerToCapture={playerName}/> 
            : 
                <NameInput 
                    addFunction={addNewPlayer} 
                    playerName={playerName}
                    setPlayerName={setPlayerName}/>
            }  
        </div>
    );
}


function NameInput({ addFunction, playerName, setPlayerName }) {
   
    return (
        <>
            {/*Player Entry Field*/}
            <div id="playerNameField">
                <h3 id="nameFieldTag">Player's Name:</h3>

                <form id="inputForm">
                    <input 
                        type="text" 
                        id="inputField"
                        value={playerName}
                        placeholder='TYPE NAME'
                        onChange={(e) => setPlayerName(e.target.value)}
                    ></input>

                    <img className="player-pic" src={profile_pic}></img>
                
                    {/*Form Submit*/}
                    <DartButton
                        orientation={90}
                        color={"grey"}>
                            <div id="checkIcon">
                                <IoCheckmarkOutline size={"4.5em"} color='white'/>
                            </div>
                    </DartButton>
                </form>
            </div>
            

            {/*Navigation (back to player entry screen)*/}
            <div id="backButton">
                <DartButton 
                    orientation={"left"}
                    color={"red"}
                />
                    <p></p>
                <DartButton />
            </div>
            
            
            {/*Software Keyboard for Player Name Entry*/}
            <Keyboard 
                submitter={addFunction} 
                inputCapture={setPlayerName}
            />
        </>
    )
}


function PhotoCapture({ toggleCapture, playerToCapture }) {
    
    // UI States
    const [countDown, setCountDown] = useState("");
    const videoRef = useRef(null); //reference to video element
    const canvasRef = useRef(null); //reference to canvas element

    // Player data states
    const [playerPic, setPlayerPic] = useState(null);
    const { addPlayer } = usePlayers();


    // Handle Countdown logic
    useEffect(() => {

        if (countDown !== "") {
            //at 0s take the photo
            if (countDown === 0) {takePhoto();}
            
            const timer = setInterval(() => {
                if(countDown === 0) {
                    clearInterval(timer);
                } else {
                    setCountDown(countDown - 1);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countDown])
    
    
    // Handle photo capture 
    const takePhoto = () => {
        
        //photo animation
        const photoFlash = () => {
            if (videoRef.current) {
                let videoElement = document.getElementById("flash");
                videoElement.classList.add("photo-flash");

                setTimeout(() => {
                    videoElement.classList.remove("photo-flash");
                }, 200);
            }
        }
        
        if (videoRef.current && canvasRef.current) {
            
            photoFlash();
            
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video stream
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            // Draw video frame onto canvas
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            videoRef.current.pause();

            // Convert canvas to image
            const imgData = canvas.toDataURL('image/png');
            setPlayerPic(imgData);
        }

        return;
    }

    // Connect to camera and start video stream
    const startVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});

            setCountDown(3);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

        } catch {
            console.error("Error: Unable to access camera");
        }
    }

    // Initialise video stream at component mount
    useEffect(() => {
        startVideoStream();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [])







    
    return (
        <>
            
            {
                countDown === 0 ?
                <div 
                    className="photoCountdown confirm-photo"
                    onClick={() => addPlayer(playerToCapture, playerPic)}
                >
                    <IoCheckmarkOutline size={"4.5em"} color='white'/>
                </div>
                :
                <div className='photoCountdown countdown'>
                    <h1>{countDown}</h1>
                </div>
            }
            
            
            <div id="photoWindow" className='photo-flash'>
                <div id="flash"></div>
                
                <video 
                    id="videoStream"
                    ref={videoRef}
                    autoPlay
                    muted>
                </video>

                <canvas
                    id="captureCanvas"
                    ref={canvasRef}
                    style={{"display": "none"}}>
                </canvas>
            </div>

            <div id="photoCaptureControls">
                <div className='control-area'>
                    <DartButton
                        orientation={"left"}
                        color={"red"}
                        action={toggleCapture}>
                        <p>BACK</p>
                    </DartButton> 

                </div>
                <div className='control-area'>
                    <ActionButton 
                        text={"Retake Photo"}
                        icon={"camera"}
                        action={startVideoStream}
                        icon_size={"1.5em"}/>
                </div>
            </div>
        </>
    )
}
