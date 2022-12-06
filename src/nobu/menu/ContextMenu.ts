import { BrowserView, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";

interface ctxMenuProps {
    view: BrowserView;
    x?: number;
    y?: number;
}

export function createContextMenu(props: ctxMenuProps) {
    const { view, x, y } = props;

    if (view.webContents.isLoading()) return;

    const template: MenuItemConstructorOptions[] = [
        {
            label: "Back",
            click() {
                if (view.webContents.canGoBack()) view.webContents.goBack();
            },
            enabled: view.webContents.canGoBack()
        },
        {
            label: "Forward",
            click() {
                if (view.webContents.canGoForward()) view.webContents.goForward();
            },
            enabled: view.webContents.canGoForward()
        },
        {
            label: "Refresh",
            click() {
                view.webContents.reload();
            }
        },
        { type: "separator" },
        {
            label: "Inspect",
            click() {
                view.webContents.toggleDevTools();
            }
        }
    ];

    const ctxMenu = Menu.buildFromTemplate(template);

    ctxMenu.popup({
        window: BrowserWindow.fromBrowserView(view)!,
        x,
        y
    });
}
