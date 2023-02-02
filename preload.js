const {contextBridge, ipcRenderer} = require('electron');

const handleSend = async () => {
    let fallback = await ipcRenderer.invoke('send-event', 'hahahhahahha')
    console.log(fallback)
}
contextBridge.exposeInMainWorld('myApi', {
    platform: process.platform,
    handleSend
})



