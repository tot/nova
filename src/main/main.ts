/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import os from 'os';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import createNode from './node';
import prisma from './prisma';
import { SendableMessage } from './types';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const node = createNode();

// TODO: type args

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  // Test Prisma query
  // const data = await prisma.peer.findMany({
  //   where: {
  //     ip: '192.168.1.1',
  //   },
  // });
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('send-file', async (event, arg: string) => {
  const filepath = arg;
  fs.readFile(filepath, { encoding: 'base64' }, (err, fileContent) => {
    const filename = path.basename(filepath);
    const message: SendableMessage = {
      type: 'file',
      data: { filename, fileContent },
    };
    node.broadcast(message);
  });
});

ipcMain.handle('listen', async (event, ...args) => {
  const msg = {
    event: 'listen',
    success: false,
  };
  node.listen(3000, '0.0.0.0', () => {
    msg.success = true;
    log.info('Node listening for incoming connections.');
  });

  return msg;
});

ipcMain.handle('connect', async (event, ...args) => {
  const msg = {
    event: 'connect',
    success: false,
  };
  const splitIP = args[0][0].split(':');
  node.connect(splitIP[0], Number(splitIP[1]), () => {
    msg.success = true;
    log.info(`Connected to ${args[0][0]}`);
  });
  return msg;
});

ipcMain.handle('get_ip', async (event, ...args) => {
  const interfaces = os.networkInterfaces();
  switch (process.platform) {
    case 'win32':
      if (interfaces['Wi-Fi']) {
        return interfaces['Wi-Fi'][1].address;
      }
      return 'IP Unavailable';
    case 'darwin':
      if (interfaces.en0) {
        return interfaces.en0[1].address;
      }
      return 'IP Unavailable';
    default:
      return 'IP Unavailable';
  }
});

node.on('_connect', async (...args) => {
  log.info(
    `Adding peer ${args[0]} - ${args[1]}:${args[2].toString()} to database`
  );
  const create = await prisma.peer.create({
    data: {
      id: args[0],
      name: '',
      ip: args[1],
      port: args[2].toString(),
    },
  });
  console.log(create);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    node.closeAll();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((data) => {
    shell.openExternal(data.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    node.closeAll();
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
