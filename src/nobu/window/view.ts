import { BrowserView } from "electron";

export function createBrowserView() {
    const view = new BrowserView();
    view.setAutoResize({
        width: true,
        height: true
    });

    return view;
}
