import * as React from "react";
import {ipcRenderer} from "electron";
import WindowSide from "../../shared/types/WindowSide";

type TouchingWindow = {
  id: number,
  side: WindowSide,
};

type WindowsConnection = {
  connectWindows: (window: TouchingWindow) => void,
  disconnectWindows: (windowId: number) => void,
  toggleWindowsConnection: (window: TouchingWindow) => void,
  touchingWindows: TouchingWindow[],
  connectedWindows: number[],
}

const useWindowsConnection = (): WindowsConnection => {
  const [connectedWindows, setConnectedWindows] = React.useState<number[]>([]);
  const [touchingWindows, setTouchingWindows] = React.useState<TouchingWindow[]>([]);

  const connectWindows = (window: TouchingWindow) => {
    if (!connectedWindows.includes(window.id)) {
      ipcRenderer.send('connect-windows', window.id, window.side);
      console.log(`connect to ${window.id} with ${window.side}`);
    }
  };

  const disconnectWindows = (windowId: number) => {
    if (connectedWindows.includes(windowId)) {
      ipcRenderer.send('disconnect-windows', windowId);
      console.log(`disconnect from ${windowId}`);
    }
  }

  const toggleWindowsConnection = (window: TouchingWindow) => {
    connectWindows(window);
    disconnectWindows(window.id);
  }

  React.useEffect(() => {
    ipcRenderer.send('window-for-connection');
    ipcRenderer.on('disconnected-window', (event, connectedId) => {
      setConnectedWindows((prev) => prev.filter(i => i !== connectedId));
      console.log('disconnect')
    });
    ipcRenderer.on('connected-window', (event, connectedId) => {
      setConnectedWindows((prev) => [...prev, connectedId]);
    });
    ipcRenderer.on('touch-start', (event, windowId: number, side: WindowSide) => {
      setTouchingWindows((prev) =>[...prev, {id: windowId, side}]);
    });
    ipcRenderer.on('touch-end', (event, windowId: number) => {
      setTouchingWindows((prev) => prev.filter(i => i.id !== windowId));
    });
  }, []);

  return {connectWindows, disconnectWindows, toggleWindowsConnection, touchingWindows, connectedWindows};
}

export default useWindowsConnection;