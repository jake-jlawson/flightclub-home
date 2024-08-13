
/** FLIGHTCLUB HOME: MAIN FILE - ELECTRON ENTRY POINT
 * @fileoverview File serves as the electron entry point and software/hardware/os interface
 * - Provides app launch
 * - Provides app window creation
 * - Handles second screen rendering
 * - Interfaces with darts scoring system
*/

/*Imports*/
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');


if (require('electron-squirrel-startup')) { // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    app.quit();
}


/** MAIN WINDOW
 * @function createWindow creates the main window for the application
 * */
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
};


/** SECOND WINDOW
 * @function createGameWindow creates the game window to display game outputs during gameplay
 * */
let secondWindow;

const createGameWindow = (mainWindow) => {
    const secondWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    secondWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}/#/second-screen`);

    mainWindow.secondWindow = secondWindow;

    return mainWindow;
}

/** INITIALISE APP
 * -This method will be called when Electron has finished initialization and is ready to create browser windows.
 * -Some APIs can only be used after this event occurs.
 * */
app.whenReady().then(() => {
    let mainWindow = createWindow();
    mainWindow = createGameWindow(mainWindow);

    // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            createGameWindow();
        }
    });
});


/** QUIT APP **/
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // On macOS it is common for applications to stay open until the user explicitly quits
        app.quit();
    }
});
