import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { BrowserTabsManager } from "./manager/BrowserTabsManager";
import { NobuServiceManager } from "./manager/NobuServiceManager";
import { AdblockerService } from "./services/AdblockerService";

type NobuRenderMode = "default" | "webview";

export class NobuBrowser {
    public window: BrowserWindow;
    public renderMode: NobuRenderMode = "default";
    public static SPACING_NO_TABS = 80 as const;
    public static SPACING_TABS = 125 as const;
    public SPACING_NO_TABS = NobuBrowser.SPACING_NO_TABS;
    public SPACING_TABS = NobuBrowser.SPACING_TABS;
    public ICON_PATH = `file://${__dirname}/../public/nobu.png` as const;
    public tabs = new BrowserTabsManager(this);
    public services = new NobuServiceManager(this);
    public channels = {
        "close-tab": (event, id) => {
            this.tabs.delete(id, true);
        },
        "history-back": (event) => {
            const wc = this._getWebContent();
            const can = wc?.canGoBack();
            if (can) wc?.goBack();
        },
        "history-forward": (event) => {
            const wc = this._getWebContent();
            const can = wc?.canGoForward();
            if (can) wc?.goForward();
        },
        navigate: (event, url) => {
            if (this.renderMode === "default") {
                this.tabs.current?.webContents.loadURL(url);
            } else {
                this.send("set-url", url);
                this.send("set-webview-url", url);
            }
        },
        "new-tab": (event) => {
            const tab = this.tabs.new();
            tab.webContents.loadURL("https://www.google.com");
            this.tabs.resize(tab);
        },
        "page-reload": (event) => {
            this._getWebContent()?.reload();
        },
        "page-reload-cancel": (event) => {
            this._getWebContent()?.stop();
        },
        "set-tab": (event, id) => {
            this.tabs.setCurrentTab(id);
        },
        "get-tabs": (event) => {
            this.tabs.broadcastTabs();
        },
        "get-url": (event) => {
            this.tabs.emitCurrentURL();
        },
        "set-webview-mode": (event, config) => {
            this.setRenderMode("webview", config);
        }
    } as NobuIncomingChannelsHandler;
    public constructor() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: true,
                devTools: this.devMode,
                webviewTag: true,
                preload: `${__dirname}/preload/main.js`
            },
            show: false,
            icon: this.ICON_PATH,
            backgroundColor: "#2b2b2b"
        });

        this._loadContent();
        this._attachListeners();
        this._initServices();
    }

    private _getWebContent() {
        return this.renderMode === "default" ? this.tabs.current?.webContents : this.window.webContents;
    }

    private async _initServices() {
        await this.services.register("adblocker", new AdblockerService(this));
    }

    private _attachListeners() {
        Object.entries(this.channels).forEach(([name, listener]) => {
            ipcMain.on(name, listener);
        });
    }

    private _removeListeners() {
        Object.entries(this.channels).forEach(([name, listener]) => {
            ipcMain.off(name, listener);
        });
    }

    public get devMode() {
        return !app.isPackaged;
    }

    private _loadContent() {
        if (this.devMode) {
            this.window.loadURL("http://localhost:3000");
        } else {
            this.window.loadFile(`${__dirname}/../dist/index.html`);
        }
    }

    public create() {
        this.window.show();
        if (this.window.isMaximizable()) this.window.maximize();
        this.tabs.broadcastTabs();
    }

    public close() {
        this._removeListeners();
        for (const v of Object.values(this.tabs.views)) {
            this.tabs.delete(v, false);
        }
        this.window.destroy();
    }

    public send<K extends keyof NobuDispatchChannels>(channel: K, ...args: NobuDispatchChannels[K]) {
        this.window.webContents.send(channel, ...args);
    }

    public setRenderMode(mode: "webview", config: WebViewModeConfig[]): void;
    public setRenderMode(mode: "default"): void;
    public setRenderMode(mode: "webview" | "default", config?: WebViewModeConfig[]): void {
        if (mode === "webview") {
            for (const view in this.tabs.views) {
                const tab = this.tabs.views[view];
                if (tab) this.tabs.remove(tab);
            }
            if (Array.isArray(config) && config.length) this.send("add-webviews", config);
            this.renderMode = "webview";
        } else {
            this.send("remove-webviews");
            for (const view in this.tabs.views) {
                const tab = this.tabs.views[view];
                if (tab) this.tabs.attach(tab, tab.webContents.id === this.tabs.current?.webContents.id);
            }
            this.renderMode = "default";
        }
    }

    public getAllTabs() {
        return this.tabs.getAllViews();
    }

    public async alert(message: string) {
        await dialog.showMessageBox(this.window, {
            message,
            buttons: ["Ok"],
            title: "Nobu"
        });
    }
}
