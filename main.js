const path = require('path')
const {app, BrowserWindow, ipcMain} = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        heiht: 800,
        webPreferences: {
            // nodeIntegration:true,
            // contextIsolation:false,
            preload: path.resolve(__dirname, './preload.js'),//预先加载的JS
        }
    })
    //win.loadURL('https://www.bailitop.com/')
    win.loadFile('index.html')
    win.webContents.openDevTools()
    //暂时关闭安全警告
    // process.env['ELECTRON_DISABLE_SECURITY_WARNNGS'] = 'true'
}

app.on('window-all-closed', () => {
    app.quit()
})

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('before-quit', () => {
    console.log('App is quiting')
})
//失去焦点
app.on('browser-window-blur', () => {
    console.log('browser-window-blur')
    setTimeout(() => {
        app.quit()
    }, 3000)

})

//获得焦点
app.on('browser-window-focus', () => {
    console.log('browser-window-focus')
})

ipcMain.handle('send-event', (event1, mag1) => {
    return mag1
})

