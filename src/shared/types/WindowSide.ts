enum WindowSide {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}

export const inverseSide = (side: WindowSide): WindowSide => {
  switch (side) {
    case WindowSide.Bottom: return WindowSide.Top;
    case WindowSide.Top: return WindowSide.Bottom;
    case WindowSide.Left: return WindowSide.Right;
    case WindowSide.Right: return WindowSide.Left;
  }
}

export default WindowSide;