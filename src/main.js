const { app, BrowserWindow } = require("electron");
let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile(require('path').join(__dirname, './render/index.html'));
  mainWindow.on("close", () => {
    mainWindow = null;
  });
  // mainWindow.webContents.openDevTools();   //启动开发者工具
});