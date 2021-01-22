import {Rectangle} from 'electron';
import WindowSide from "../../../shared/types/WindowSide";

type GetRectTouchingSide = (rect1: Rectangle, rect2: Rectangle) => WindowSide

const getRectTouchingSide: GetRectTouchingSide = (
  {x: x1, y: y1, height: height1, width: width1},
  {x: x2, y: y2, height: height2, width: width2}
) => {
  const range = 10;
  const isTouchingRight =
    isInRange(x2, x1 + width1, range) && // are Xs close
    (isInRange(y1, y2 + height2 / 2, height2 / 2) || isInRange(y1 + height1, y2 + height2 / 2, height2 / 2)) // Are Ys not too far
      ? WindowSide.Right : null;
  const isTouchingLeft =
    isInRange(x1, x2 + width2, range) &&
    (isInRange(y1, y2 + height2 / 2, height2 / 2) || isInRange(y1 + height1, y2 + height2 / 2, height2 / 2))
      ? WindowSide.Left : null;

  const isTouchingTop =
    isInRange(y2, y1 - height2, range) &&
    (isInRange(x1, x2 + width2 / 2, width2 / 2) || isInRange(x1 + width1, x2 + width2 / 2, width2 / 2))
      ? WindowSide.Top : null;
  const isTouchingBottom =
    isInRange(y1, y2 - height1, range) &&
    (isInRange(x1, x2 + width2 / 2, width2 / 2) || isInRange(x1 + width1, x2 + width2 / 2, width2 / 2))
      ? WindowSide.Bottom : null;

  return isTouchingRight || isTouchingLeft || isTouchingTop || isTouchingBottom;
}

function isInRange(a: number, b: number, range: number): boolean {
  return a >= b - range && a <= b + range;
}

export default getRectTouchingSide;
