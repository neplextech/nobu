import { BrowserView, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { NobuBrowser } from "../NobuBrowser";

interface ctxMenuProps extends Electron.ContextMenuParams {
    view: BrowserView;
    nobu: NobuBrowser;
}

export function createContextMenu(props: ctxMenuProps) {
    const { view, x, y, nobu } = props;

    if (view.webContents.isLoading()) return;

    const template: MenuItemConstructorOptions[] = [
        {
            label: "Open Link in New Tab",
            click() {
                nobu.tabs.openInNewTab(props.linkURL);
            },
            visible: !!props.linkURL
        },
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
