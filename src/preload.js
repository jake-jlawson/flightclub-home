// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');


/** GAME SCREEN API
 * @contextBridge Expose second screen API to the renderer process
 */
contextBridge.exposeInMainWorld('gameScreen', {
    open: () => ipcRenderer.send('open-game-screen'),
    close: () => ipcRenderer.send('close-game-screen'),
});