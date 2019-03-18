'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow (phoenixApp, phoenixAddr) {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the phoenix app of the app.
  mainWindow.loadURL('http://localhost:4000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    phoenixApp.kill('SIGINT');
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  var phoenixApp = require('child_process').spawn('mix', ['phx.server']);
  var rp = require('request-promise');

  function start() {
  rp('http://localhost:4000')
    .then(function (htmlString) {
      console.log('phoenix server started~!');
      createWindow(phoenixApp);
    })
    .catch(function (error) {
      console.log('Waiting on server to start...');
      setTimeout(start, 1000);
    });
  }
  start();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
