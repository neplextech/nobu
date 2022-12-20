import { BrowserView, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { NobuBrowser } from "../NobuBrowser";
import { commandAccelerators } from "../utils/accelerators";
import { getDefaultScreens } from "../screens/createScreens";

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
            accelerator: commandAccelerators.MenuDefault.reloadWindow,
            click() {
                view.webContents.reload();
            }
        },
        { type: "separator" },
        {
            label: "Toggle Multi-View Mode",
            click() {
                if (nobu.renderMode === "default") {
                    if (!nobu.tabs.current) return;
                    const url = nobu.tabs.current?.getCurrentURL();
                    if (!url) return;
                    const screens: NobuSplitView[] = getDefaultScreens(url);

                    nobu.setRenderMode("webview", screens);
                } else {
                    nobu.setRenderMode("default");
                }
            },
            accelerator: commandAccelerators.MenuDefault.toggleMultiView
        },
        {
            label: "Inspect",
            accelerator: commandAccelerators.BrowserViewContext.inspect,
            click() {
                try {
                    view.webContents.inspectElement(x, y);
                } catch {
                    if (!view.webContents.isDevToolsOpened()) view.webContents.openDevTools();
                }
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
