
/** FLIGHTCLUB HOME: MAIN FILE - ELECTRON ENTRY POINT
 * @fileoverview File serves as the electron entry point and software/hardware/os interface
 * - Provides app launch
 * - Provides app window creation
 * - Handles second screen rendering
 * - Interfaces with darts scoring system
*/

/*Imports*/
const { app, BrowserWindow, ipcMain } = require('electron');
const { create } = require('node:domain');
const path = require('node:path');


if (require('electron-squirrel-startup')) { // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    app.quit();
}


/** MAIN WINDOW
 * @function createWindow creates the main window for the application
 * */
let mainWindow;
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // load the index.html of the app.

    mainWindow.webContents.openDevTools(); // Open the DevTools.

    // close the app when the main window is closed
    mainWindow.on('close', () => {
        app.quit();
    })

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 800,
                height: 600,
                webPreferences: {
                    contextIsolation: true,
                    enableRemoteModule: false,
                    nodeIntegration: false,
                },
            }
        }
    });
};


/** SECOND WINDOW
 * @listener overrides second window creation options
 * */



/** SECOND WINDOW
 * @function createGameWindow creates the game window to display game outputs during gameplay
 * */
let gameWindow;
const createGameWindow = () => {
    const gameWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    gameWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}/#/game-window`);

    return gameWindow;
}

/** INITIALISE APP
 * -This method will be called when Electron has finished initialization and is ready to create browser windows.
 * -Some APIs can only be used after this event occurs.
 * */
app.whenReady().then(() => {
    mainWindow = createWindow();

    // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createWindow();
        }
    });
});


/** QUIT APP **/
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // On macOS it is common for applications to stay open until the user explicitly quits
        app.quit();
    }
});


// ipcMain.handle('open-game-window', async (event, arg) => {
//     if (!gameWindow) {
//         gameWindow = createGameWindow();
//     }

//     gameWindow.on('closed', () => {
//         gameWindow = null;
//         event.sender.send('game-window-closed');
//     })

//     await gameWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}/#/game-window`);

//     return gameWindow.webContents.id;
// });