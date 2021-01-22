import {BrowserWindow, Rectangle} from "electron";
import WindowSide from "../../../shared/types/WindowSide";

type Disconnector = {
  id1: number,
  id2: number,
  disconnect: () => void
}

const disconnectors: Disconnector[] = []

const connectWindows = (win1: BrowserWindow, win2: BrowserWindow, side: WindowSide): void => {
  const win1Bound = win1.getBounds();
  const win2Bound = win2.getBounds();
  const windows = [win1, win2];
  console.log(win1.id, win2.id)

  // Align position
  switch (side) {
    case WindowSide.Top:
      win2.setBounds({y: win1Bound.y - win2Bound.height});
      break;
    case WindowSide.Bottom:
      win2.setBounds({y: win1Bound.y + win1Bound.height});
      break;
    case WindowSide.Right:
      win2.setBounds({x: win1Bound.x + win1Bound.width});
      break;
    case WindowSide.Left:
      win2.setBounds({x: win1Bound.x - win2Bound.width});
      break;
  }

  const onWillMove = (event: any, newBounds: Rectangle) => {
    const initiator: BrowserWindow = event.sender;
    const listener = windows.find(i => i.id !== event.sender.id);
    const prevBounds = initiator.getBounds();
    const listenerBounds = listener.getBounds();

    listener.setPosition(
      listenerBounds.x + newBounds.x - prevBounds.x,
      listenerBounds.y + newBounds.y - prevBounds.y
    )
  }

  /*const onResize = (event: any) => {
    const initiator = event.sender;
    const listener: BrowserWindow = windows.find(i => i.id !== event.sender.id);
    const {height} = initiator.getBounds();
    listener.setBounds({height});
    onMove(event)
  };*/

  const onMinimize = (event: any) => {
    windows.find(i => i.id !== event.sender.id).minimize();
  }

  const onRestore = (event: any) => {
    windows.find(i => i.id !== event.sender.id).restore();
  }

  const disconnectWindows = () => {
    windows.forEach(win => {
      // win.removeListener('resize', onResize);
      win.removeListener('minimize', onMinimize);
      win.removeListener('restore', onRestore);
      win.removeListener('will-move', onWillMove);
    });
  }

  disconnectors.push({
    id1: win1.id,
    id2: win2.id,
    disconnect: disconnectWindows
  })

  windows.forEach(win => {
    // win.on('resize', onResize);
    win.on('minimize', onMinimize);
    win.on('restore', onRestore);
    win.on('close', disconnectWindows);
    win.on('will-move', onWillMove);
  });
  win1.webContents.send('connected-window', win2.id);
  win2.webContents.send('connected-window', win1.id);
}

const disconnectWindows = (win1: BrowserWindow, win2: BrowserWindow): void => {
  const pos = disconnectors.findIndex(i => (i.id1 === win1.id && i.id2 === win2.id) || (i.id1 === win2.id && i.id2 === win1.id));
  if (pos === -1) {
    console.log(`No connection between windows ${win1.id} and ${win2.id}`);
    return;
  }
  const disconnector = disconnectors.splice(pos, 1)[0];
  disconnector.disconnect();
  win1.webContents.send('disconnected-window', win2.id);
  win2.webContents.send('disconnected-window', win1.id);
}

export {connectWindows, disconnectWindows};