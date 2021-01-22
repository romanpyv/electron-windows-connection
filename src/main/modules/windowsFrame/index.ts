import {BrowserWindow, ipcMain} from 'electron';

const applyWindowsFrame = () => {
  ipcMain.on('minimize', event => {
    BrowserWindow.fromId(event.sender.id).minimize();
  });

  ipcMain.on('maximize', event => {
    BrowserWindow.fromId(event.sender.id).maximize();
  });

  ipcMain.on('close', event => {
    BrowserWindow.fromId(event.sender.id).close();
  });
};

export default applyWindowsFrame;