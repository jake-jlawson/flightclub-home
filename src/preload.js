// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');


/** GAME SCREEN API
 * @contextBridge Expose second screen API to the renderer process
 */
contextBridge.exposeInMainWorld('gameScreen', {
    open: async () => {
        const windowID = await ipcRenderer.invoke('open-game-window');

        ipcRenderer.on('game-window-closed', () => {
            window.dispatchEvent(new CustomEvent('gameWindowClosed'));
        });

        return windowID;
    },

    close: () => ipcRenderer.send('close-game-screen'),

    getGameWindowID: () => ipcRenderer.invoke('get-game-window'),
});