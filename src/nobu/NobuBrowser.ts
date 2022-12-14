import { app, BrowserWindow, dialog, ipcMain, nativeTheme, shell, session } from "electron";
import { BrowserTabsManager } from "./manager/BrowserTabsManager";
import { NobuServiceManager } from "./manager/NobuServiceManager";
import { getDefaultScreens } from "./screens/createScreens";
import { AdblockerService } from "./services/AdblockerService";
import { isDev } from "./utils/isDev";

type NobuRenderMode = "default" | "webview";

export class NobuBrowser {
    public app = app;
    public theme = nativeTheme;
    public shell = shell;
    public window: BrowserWindow;
    public renderMode: NobuRenderMode = "default";
    public static SPACING_NO_TABS = 80 as const;
    public static SPACING_TABS = 125 as const;
    public SPACING_NO_TABS = NobuBrowser.SPACING_NO_TABS;
    public SPACING_TABS = NobuBrowser.SPACING_TABS;
    public ICON_PATH = `file://${__dirname}/../public/nobu.png` as const;
    public tabs = new BrowserTabsManager(this);
    public services = new NobuServiceManager(this);
    public offlineModeEmulation = false;
    public channels = {
        "close-tab": (event, id) => {
            if (this.renderMode === "webview") return this.alert("Tabs cannot be deleted in multi-views mode");
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
            if (this.renderMode === "webview") return this.alert("Tabs cannot be created in multi-views mode");
            const tab = this.tabs.new();
            tab.webContents.loadURL("https://www.google.com");
            this.tabs.resize(tab);
        },
        "page-reload": (event) => {
            if (this.renderMode === "default") {
                this._getWebContent()?.reload();
            } else this.send("trigger-reload");
        },
        "page-reload-cancel": (event) => {
            if (this.renderMode === "default") this._getWebContent()?.stop();
            else this.send("cancel-reload");
        },
        "set-tab": (event, id) => {
            if (this.renderMode === "default") this.tabs.setCurrentTab(id);
        },
        "get-tabs": (event) => {
            this.tabs.broadcastTabs();
        },
        "get-url": (event) => {
            this.tabs.emitCurrentURL();
        },
        "set-webview-mode": (event, config) => {
            this.setRenderMode("webview", config);
        },
        "zoom-in": () => {
            this.handleZoomAction("zoom-in");
        },
        "zoom-out": () => {
            this.handleZoomAction("zoom-out");
        },
        "zoom-reset": () => {
            this.handleZoomAction("zoom-reset");
        },
        "network-offline-emulation": (_, set) => {
            const session = this.getDefaultSession();
            session.enableNetworkEmulation({ offline: !!set });
            this.offlineModeEmulation = !!set;
            this.send("network-offline-emulation", !!set);
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

        if (isDev) this.window.webContents.openDevTools({ mode: "detach" });
    }

    private _getWebContent() {
        return this.renderMode === "default" ? this.tabs.current?.webContents : this.window.webContents;
    }

    private async _initServices() {
        await this.services.register("adblocker", new AdblockerService(this), true);
    }

    private _attachListeners() {
        Object.entries(this.channels).forEach(([name, listener]) => {
            ipcMain.on(name, listener);
        });
        const session = this.getDefaultSession();
        session.webRequest.onBeforeRequest((details, cb) => {
            if (this.offlineModeEmulation)
                return cb({
                    cancel: true
                });
            return cb({});
        });
    }

    private _removeListeners() {
        Object.entries(this.channels).forEach(([name, listener]) => {
            ipcMain.off(name, listener);
        });
    }

    public get devMode() {
        return isDev;
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

    public setRenderMode(mode: "webview", config: WebViewModeConfig[] | string | boolean): void;
    public setRenderMode(mode: "default"): void;
    public setRenderMode(mode: "webview" | "default", config?: WebViewModeConfig[] | string | boolean): void {
        if (mode === "webview") {
            for (const view in this.tabs.views) {
                const tab = this.tabs.views[view];
                if (tab) this.tabs.remove(tab);
            }
            if (Array.isArray(config) && config.length) {
                this.send("add-webviews", config);
            } else if (typeof config === "string") {
                const screens = getDefaultScreens(config, "all");
                this.send("add-webviews", screens);
            } else if (typeof config === "boolean") {
                if (!config) return this.setRenderMode("default");
                if (this.renderMode === "webview") return this.setRenderMode("default");
                const url = this.tabs.getCurrentURL();
                if (!url) return;
                const screens = getDefaultScreens(url, "all");
                this.send("add-webviews", screens);
            }
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

    public handleZoomAction(action: "zoom-in" | "zoom-out" | "zoom-reset") {
        if (this.renderMode === "webview") {
            this.send(action, Date.now());
        } else {
            const current = this.tabs.current;
            if (current) {
                const currentLvl = current.webContents.getZoomLevel();
                const lvl = action === "zoom-in" ? currentLvl + 1 : action === "zoom-out" ? currentLvl - 1 : 0;
                current.webContents.setZoomLevel(lvl);
            }
        }
    }

    public reloadWindow() {
        if (this.renderMode === "default") {
            this.tabs.current?.webContents.reload();
        } else {
            this.send("trigger-reload");
        }
    }

    public getCurrentSession() {
        return this._getWebContent()?.session || this.getDefaultSession();
    }

    public getDefaultSession() {
        return session.defaultSession;
    }
}
