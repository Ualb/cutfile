const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path')
const {CsvCut} = require('./js/csv');
const {Xlsx} = require("./js/xlsx");

const createWindow = () => {
    // set the properties for the window
    const window = new BrowserWindow({
        width: 850, height: 600, webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.on('closeWindow', () => {
        window.close();
    })

    window.loadFile('index.html')
}

// load the window
app.whenReady().then(() => {
    createWindow()

    // if aren't windows opens
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// if isn't a macOS user
app.on('window-all-closed', () => {
    app.quit()
    // if (process.platform !== 'darwin') app.quit()
});


// EVENT'S
ipcMain.on('toMain', async (event, data) => {
    const extensionFile = data.filePath.split("/").pop().split(".").pop();
    let result;
    switch (extensionFile) {
        case 'csv': {
            result = await CsvCut.cut(data.filePath, (data.folderPath ? data.folderPath : __dirname), data.cutSize, data.firstLineHeaders, data.fileNamePattern);
            break;
        }
        case 'xlsx': {
            result = await Xlsx.cut(data.filePath, (data.folderPath ? data.folderPath : __dirname), parseInt(data.cutSize), data.firstLineHeaders, data.fileNamePattern)
            break;
        }
    }
    event.reply('process-replay', result);
});


function pausar(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
