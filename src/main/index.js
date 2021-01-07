'use strict';

import {app, BrowserWindow, dialog} from 'electron';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`;

/**
 * create Window
 */
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: { // 配置web参数选项
      plugins: true, // 开启插件
      webSecurity: false, // 安全
      defaultFontFamily: { // 字体相关
        standard: "Microsoft YaHei",
        defaultEncoding: "utf-8",
      },
    },
  });

  mainWindow.loadURL(winURL);
  mainWindow.webContents.openDevTools(); // 线上调试需要打开此服务
  mainWindow.on('close', (e) => {
    e.preventDefault();
    dialog.showMessageBox({
      type: 'warning',
      title: 'info tips',
      message: 'Do you want to close the application?',
      buttons: ['cancel', 'confirm'],
    }, (idx) => {
      if (idx == 0) {
        e.preventDefault(); // 阻止默认事件，阻止窗口关闭
      } else {
        mainWindow = null;
        // app.quit()不能用会弹两次
        app.exit();
      }
    });
  });
  mainWindow.webContents.on('crashed', () => {
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出'],
    };
    recordCrash().then(() => {
      dialog.showMessageBox(options, (index) => {
        if (index === 0) {
          reloadWindow(mainWindow);
        } else {
          app.quit();
        }
      });
    }).catch((e) => {
      console.log('err', e);
    });
  });

  // eslint-disable-next-line require-jsdoc
  function recordCrash() {
    return new Promise(resolve => {
      // 崩溃日志请求成功....
      resolve();
    });
  }

  // eslint-disable-next-line require-jsdoc
  function reloadWindow(mainWin) {
    if (mainWin.isDestroyed()) {
      app.relaunch();
      app.exit(0);
    } else {
      BrowserWindow.getAllWindows().forEach((w) => {
        if (w.id !== mainWin.id) w.destroy();
      });
      mainWin.reload();
    }
  }
  mainWindow.setMenu(null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

