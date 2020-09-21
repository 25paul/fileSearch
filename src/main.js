// const { app, BrowserWindow } = require('electron');
// let mainWindow = null;

// app.on('ready', () => {
//     mainWindow = new BrowserWindow({    // 创建和控制浏览器窗口
//         width: 800,                     // 窗口宽度
//         height: 600,                    // 窗口高度
//         webPreferences: {               // 网页功能设置
//             nodeIntegration: true,      // 是否在node工作器中启用工作集成默认false
//             enableRemoteModule: true,   // 是否启用remote模块默认false
//         }
//     });
//     mainWindow.loadFile('index.html');  // 加载页面
//     mainWindow.on('close', () => {      // 监听窗口关闭
//         console.log('window close!')
//         mainWindow = null
//     })

// })

const { app, BrowserWindow } = require("electron");
let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile(require('path').join(__dirname, './render/index.html'));
  mainWindow.on("close", () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();   //启动开发者工具
});