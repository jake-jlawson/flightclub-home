import React, { useState, useEffect } from "react";


export default function SecondScreen() {
    const [content, setContent] = useState();

    useEffect(() => {
        window.ipcRenderer.on('update-second-screen', (event, newContent) => {
            setContent(newContent);
        });

        window.ipcRenderer.on('clear-second-screen', (event) => {
            setContent(null);
        });

        return () => {
            window.ipcRenderer.removeAllListeners('update-second-screen');
            window.ipcRenderer.removeAllListeners('clear-second-screen');
        }
    }, []);

    return <>{content}</>
}