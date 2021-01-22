import {BrowserWindow} from "electron";
import getRectTouchingSide from "./getRectTouchingSide";
import WindowSide from "../../../shared/types/WindowSide";

type DetectWindowsTouch = (
  win1: BrowserWindow,
  win2: BrowserWindow,
  onTouch: (side: WindowSide) => void,
  onLeave?: () => void
) => () => void;

const detectWindowsTouch: DetectWindowsTouch = (win1, win2, onTouch, onLeave) => {
  const windows = [win1, win2];

  function touchListener() {
    const isTouching = getRectTouchingSide(win1.getBounds(), win2.getBounds());
    if (isTouching) {
      onTouch(isTouching);
      windows.forEach(win => {
        win.removeListener('move', touchListener);
        win.on('move', leaveListener);
      });
    }
  }

  function leaveListener() {
    const isTouching = getRectTouchingSide(win1.getBounds(), win2.getBounds());

    if (!isTouching) {
      onLeave();
      windows.forEach(win => {
        win.removeListener('move', leaveListener);
        win.on('move', touchListener);
      });
    }
  }

  const stopDetection = () => {
    windows.forEach(win => {
      win.removeListener('move', leaveListener);
      win.removeListener('move', touchListener);
    });
  }

  windows.forEach(win => {
    win.on('move', touchListener);
    win.on('close', stopDetection);
  });

  return stopDetection;
}

export default detectWindowsTouch;