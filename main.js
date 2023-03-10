const {app, BrowserWindow, ipcMain, dialog,Menu } = require('electron');
const path = require('path');
const WinState = require("electron-win-state").default;

const isMac = process.platform === 'darwin'
const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: '动作',
        submenu: [
            {
                label: 'DevTools',
                role: 'toggleDevTools'
            },
            {
                role:'toggleFullScreen'
            },
            {
                label: 'Greet',
                click:()=>{
                    console.log('hello');
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },

    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
];


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const winState = new WinState({
    defaultWidth: 800,
    defaultHeight: 600,
    // other winState options, see below
})


const createWindow = () => {
    const win = new BrowserWindow({
        ...winState.winOptions,
        // width: 1000,
        // heiht: 800,
        // x:200,
        // y:200,
        // show:false,
        backgroundColor: '#6435c9',
        // frame:false,//关闭状态栏
        webPreferences: {
            // nodeIntegration:true,
            // contextIsolation:false,
            preload: path.resolve(__dirname, './preload.js'),//预先加载的JS,为了将脚本附在渲染进程上，在 BrowserWindow 构造器中使用 webPreferences.preload 传入脚本的路径。
        }
    })

    // win.loadURL('https://www.bailitop.com/')
    win.loadFile('index.html')

    //打开开发者工具
    // win.webContents.openDevTools();
    const wc  = win.webContents;
    // wc.openDevTools()


    //暂时关闭安全警告
    // process.env['ELECTRON_DISABLE_SECURITY_WARNNGS'] = 'true'



    wc.on('did-finish-load', ()=>{
        console.log('finished.')
    })

    wc.on('dom-ready', ()=>{
        console.log('dom-ready')
    })



    wc.on('context-menu',(e,params)=>{
        //在页面中注入JS
        // wc.executeJavaScript(`alert('${params.selectionText}')`)

        //打开文件夹&文件
        // dialog.showOpenDialog({
        //     buttonLabel:'选择',//选择框按钮名字
        //     defaultPath:app.getPath('music'),
        //     properties:['multiSelections', 'createDirectory', 'openFile', 'openDirectory',]
        // }).then((result)=>{
        //     console.log(result.filePaths)
        // })


        //存储到文件夹中
        // dialog.showSaveDialog().then(result=>{
        //     console.log(result.filePath)
        // })


        //右键弹窗选择框
        // const answer = ['Yes', 'No', 'Maybe']
        // dialog.showMessageBox({
        //     title:'Message Box',
        //     message:'please select an option',
        //     detail:'Message details',
        //     buttons:answer
        // }).then(({response}) =>{
        //     console.log(`User select: ${answer['response']}`)
        // })

    })




    win.on('ready-to-show',()=>{

    })

    //子级窗口
    // const win2 = new BrowserWindow({
    //     width:600,
    //     height:400,
    //     parent:win,
    //     modal:true,//模态窗口
    // })
    // win2.loadURL('https://www.baidu.com')

    winState.manage(this.win)

}
console.log(winState.winOptions)

app.on('window-all-closed', () => {
    app.quit()
})

// app.on('ready-to-show',()=>{
//     win.show
// })

// app.loadURL('https://www.bailitop.com/')


app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    console.log(app.getPath('desktop'));
    console.log(app.getPath('music'));
    console.log(app.getPath('temp'));
    console.log(app.getPath('userData'));
})

app.on('before-quit', () => {
    console.log('App is quiting')
})
//失去焦点
// app.on('browser-window-blur', () => {
//     console.log('browser-window-blur')
//     setTimeout(() => {
//         app.quit()
//     }, 3000)
// })

//获得焦点
app.on('browser-window-focus', () => {
    console.log('browser-window-focus')
})


ipcMain.handle('send-event', (event1, mag1) => {
    return mag1
})

