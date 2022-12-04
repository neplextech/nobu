import { BrowserView, BrowserWindow } from "electron";

export function resizeView(view: BrowserView, win: BrowserWindow) {
    const bound = win.getBounds();
    view.setBounds({ x: 0, y: 80, width: bound.width, height: bound.height - 80 });
}
