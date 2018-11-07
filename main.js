const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const {app, BrowserWindow} = electron;


let mainWindow;
let mainWindowData = null;
let mainWindowDataFile = path.join(app.getPath('userData'), 'window.json');


function loadMainWindowConfig() {
    var savedData;
    
    if (!fs.existsSync(mainWindowDataFile)) {
        return {};
    }
    
    try {
        savedData = JSON.parse(fs.readFileSync(mainWindowDataFile, 'utf-8'));
    } catch (e) {
        return {};
    }

    return savedData;
}

function saveMainWindowConfig(window) {
    var saveData = {};
    
    try {
        var bounds = window.getBounds();

        saveData['x'] = bounds.x;
        saveData['y'] = bounds.y;
        saveData['width'] = bounds.width;
        saveData['height'] = bounds.height;
        saveData['maximized'] = window.isMaximized();
        
        fs.writeFileSync(mainWindowDataFile, JSON.stringify(saveData));
    } catch (e) {
        return;
    }
}


// listen for app to be ready
app.on('ready', function() {
    
    mainWindoConfig = loadMainWindowConfig();
    mainWindoConfig['frame'] = false;
    mainWindoConfig['minWidth'] = 350;
    mainWindoConfig['minHeight'] = 500;

    mainWindow = new BrowserWindow(mainWindoConfig);
    if (mainWindoConfig.maximized) {
        mainWindow.maximize();
    }

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


    mainWindow.on('close', function(e) {
        saveMainWindowConfig(mainWindow);
    });
    
    mainWindow.on('closed', function(e) {
        app.quit()
    });


    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
});
