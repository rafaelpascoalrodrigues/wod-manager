const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow} = electron;


let mainWindow;

// listen for app to be ready
app.on('ready', function() {
    
    mainWindow = new BrowserWindow({frame: false, minHeight: 500, minWidth: 350});
    mainWindow.webContents.openDevTools();

    mainWindow.on('maximize', function () {
        mainWindow.webContents.send('browserwindow-maximized');
    });

    mainWindow.on('unmaximize', function () {
            mainWindow.webContents.send('browserwindow-unmaximized');
    });

    mainWindow.webContents.once('did-finish-load', function() {
        if (mainWindow.isMaximized()) {
            mainWindow.webContents.send('browserwindow-maximized');
        }
    });


    mainWindow.on('closed', function() {
        app.quit()
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
});
