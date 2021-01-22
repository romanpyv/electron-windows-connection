import {BrowserWindow, ipcMain} from "electron";
import detectWindowsTouch from "./detectWindowsTouch";
import WindowSide, {inverseSide} from "../../../shared/types/WindowSide";
import {connectWindows, disconnectWindows} from "./connectWindows";

const applyWindowsConnection = () => {
  const windowsForConnection: BrowserWindow[] = [];

  ipcMain.on('window-for-connection', event => {
    const initiator = BrowserWindow.fromId(event.sender.id);
    windowsForConnection.push(BrowserWindow.fromId(event.sender.id));

    if (windowsForConnection.length < 1) return;

    windowsForConnection.forEach(win => {
      if (win === initiator) return;
      console.log(win.id, initiator.id)
      detectWindowsTouch(win, initiator,
        (side) => {
          win.webContents.send('touch-start', initiator.id, side);
          initiator.webContents.send('touch-start', win.id, inverseSide(side));
        },
        () => {
          win.webContents.send('touch-end', initiator.id);
          initiator.webContents.send('touch-end', win.id);
        });
    });
  });

  ipcMain.on('connect-windows', (event, windowId: number, side: WindowSide) => {
    const win1 = BrowserWindow.fromId(event.sender.id);
    const win2 = BrowserWindow.fromId(windowId);
    connectWindows(win1, win2, side);
  });

  ipcMain.on('disconnect-windows', (event, windowId: number) => {
    const win1 = BrowserWindow.fromId(event.sender.id);
    const win2 = BrowserWindow.fromId(windowId);
    console.log(`disconnect ${win1.id} ${win2.id}`)
    disconnectWindows(win1, win2);
  });
};

export default applyWindowsConnection;