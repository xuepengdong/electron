const {contextBridge, ipcRenderer} = require('electron');

const handleSend = async () => {
    let fallback = await ipcRenderer.invoke('send-event', 'hahahhahahha')
    console.log(fallback)
}
contextBridge.exposeInMainWorld('myApi', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    platform: process.platform,
    handleSend
})



