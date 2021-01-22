import {app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent} from 'electron';
import applyWindowsConnection from "./modules/windowsConnection";
import applyWindowsFrame from "./modules/windowsFrame";

const mainWindowPath = './dist/mainWindow/index.html';

function createWindow(template: string, options: Partial<BrowserWindowConstructorOptions>) {
  const win = new BrowserWindow({
    ...options,
    minWidth: 150,
    minHeight: 300,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  win.loadFile(template).catch(err => console.log('Error', err));

  return win;
}

app.whenReady().then(() => createWindow(mainWindowPath, {width: 200, height: 300}));
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(mainWindowPath, {width: 200, height: 500});
  }
});

ipcMain.on('create-new-window', (event: IpcMainEvent) => {
  createWindow('./dist/secondWindow/index.html', {x: 700, y: 300, width: 400, height: 300});
});

applyWindowsConnection();

applyWindowsFrame();
