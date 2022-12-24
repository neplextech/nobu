import { app, BrowserWindow, dialog, ipcMain, nativeTheme, shell, session, webContents } from "electron";
import { BrowserTabsManager } from "./manager/BrowserTabsManager";
import { NobuServiceManager } from "./manager/NobuServiceManager";
import { getDefaultScreens } from "./screens/createScreens";
import { AdblockerService } from "./services/AdblockerService";
import { ProtocolService } from "./services/ProtocolService";
import { isDev } from "./utils/isDev";
import { EventEmitter } from "./utils/EventEmitter";
import { isWindows } from "./utils/platform";
import { NobuTab } from "./structures/NobuTab";
import { StorageService } from "./services/StorageService";
import { resolveSearchEngine, resolveSearchEngineName } from "./utils/resolveSearchEngine";
import { SEARCH_ENGINE, USER_AGENT } from "./utils/constants";

type INobuEventsMap = {
    resize: () => Awaited<void>;
    ready: () => Awaited<void>;
};

export class NobuBrowser extends EventEmitter<INobuEventsMap> {
    public app = app;
    public theme = nativeTheme;
    public shell = shell;
    public window: BrowserWindow;
    public renderMode: NobuRenderMode = "default";
    public static SPACING_NO_TABS = 80 as const;
    public static SPACING_TABS = 125 as const;
    public static SPACING_FULLSCREEN = 0 as const;
    public SPACING_NO_TABS = NobuBrowser.SPACING_NO_TABS;
    public SPACING_TABS = NobuBrowser.SPACING_TABS;
    public SPACING_FULLSCREEN = NobuBrowser.SPACING_FULLSCREEN;
    public CLIENT_SPACING: number = this.SPACING_TABS;
    public CLIENT_HEIGHT: number = 0;
    public ICON_PATH = `file://${__dirname}/../public/nobu.png` as const;
    public tabs = new BrowserTabsManager(this);
    public services = new NobuServiceManager(this);
    public offlineModeEmulation = false;
    public splitViewTabId: string | null = null;
    private __lastNavigationURL: string | null = null;
    public channels = {
        "close-tab": (event, id) => {
            if (this.renderMode === "webview") return this.alert("Tabs cannot be deleted in multi-views mode");
            this.tabs.destroy(id, true);
        },
        "history-back": (event) => {
            if (this.renderMode === "webview") return this.send("trigger-back", this.tabs.currentId!);
            this.tabs.current?.goBack();
        },
        "history-forward": (event) => {
            if (this.renderMode === "webview") return this.send("trigger-forward", this.tabs.currentId!);
            this.tabs.current?.goForward();
        },
        navigate: (event, id, address) => {
            const url = typeof address === "string" ? address : this.makeSearchEngineQuery(address.search);
            if (url === this.__lastNavigationURL) return;
            this.__lastNavigationURL = url;
            this.tabs.get(id)?.webContents?.loadURL(url);
            this.send("set-url", id, url);
            if (this.renderMode === "webview") this.send("set-webview-url", id, url);
        },
        "new-tab": (event) => {
            if (this.renderMode === "webview") return this.alert("Tabs cannot be created in multi-views mode");
            const tab = this.tabs.new();
            tab.webContents?.loadURL(this.getDefaultPageURL());
            tab.resize();
            tab.focus();
        },
        "page-reload": (event, id) => {
            if (this.renderMode === "default") {
                this.tabs.get(id)?.webContents?.reload();
            } else this.send("trigger-reload", this.tabs.currentId!);
        },
        "page-reload-cancel": (event, id) => {
            if (this.renderMode === "default") this.tabs.get(id)?.webContents?.stop();
            else this.send("cancel-reload", this.tabs.currentId!);
        },
        "set-tab": (event, id) => {
            if (this.renderMode === "default") this.tabs.setCurrentTab(id);
        },
        "get-tabs": (event) => {
            this.tabs.broadcastTabs();
        },
        "get-url": (event, id) => {
            this.tabs.get(id)?.emitCurrentURL();
        },
        "zoom-in": (_, id) => {
            this.handleZoomAction("zoom-in", id);
        },
        "zoom-out": (_, id) => {
            this.handleZoomAction("zoom-out", id);
        },
        "zoom-reset": (_, id) => {
            this.handleZoomAction("zoom-reset", id);
        },
        "network-offline-emulation": (_, set) => {
            const session = this.getDefaultSession();
            session.enableNetworkEmulation({ offline: !!set });
            this.offlineModeEmulation = !!set;
            this.send("network-offline-emulation", !!set);
        },
        "open-multiview-settings": () => {
            // TODO
            // this.tabs.openInNewTab("nobu-settings://multiview");
        },
        "set-splitview-mode": (_, id, data) => {
            this.splitViewTabId = id;
            this.setRenderMode("webview", data || "");
        },
        __$ch: (_, h, ch) => {
            if (!isNaN(h) && h >= 0) this.CLIENT_SPACING = h;
            if (!isNaN(ch) && ch > 0) this.CLIENT_HEIGHT = ch;

            this.emit("resize");
        },
        __$ready: () => {
            this.emit("ready");
        },
        "set-loading": (_, id, loading) => {
            if (loading) this.send("reloading", id);
            else this.send("reloaded", id);
        },
        "set-title": (_, id, title) => {
            const tab = this.tabs.get(id);
            if (tab) tab.setTitle(title);
            this.tabs.broadcastTabs();
        },
        "set-favicon": (_, id, icn) => {
            if (!icn) return;
            const tab = this.tabs.get(id);
            if (tab) tab.setFavicon(icn);
            this.tabs.broadcastTabs();
        },
        __$internal: (_, config) => {
            if (!config?.page) return this.setRenderMode("default");
            if (config.page)
                return this.setRenderMode("protected", {
                    page: config.page,
                    tabId: config.tabId
                });
        },
        "get-settings": (_) => {
            const settings = this.services.getService("store").settings.store;
            const data = {
                ...settings,
                searchEngine: resolveSearchEngineName(settings.searchEngine) || "google"
            };

            this.send("nobu-settings", data);
        },
        "set-settings": (_, setting) => {
            this.services.getService("store").settings.set({
                searchEngine: resolveSearchEngine(setting.searchEngine)
            });
        }
    } as Partial<NobuIncomingChannelsHandler>;

    public constructor() {
        super();
        this.setMaxListeners(Infinity);
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

        this.window.webContents.setUserAgent(USER_AGENT);

        this._loadContent();
        this._attachListeners();
        this._initServices();

        if (isDev) this.window.webContents.openDevTools({ mode: "detach" });
    }

    public makeSearchEngineQuery(i: string) {
        try {
            const settings = this.services.getService("store").settings;
            const engine = settings.get("searchEngine");

            return `${engine}${i}`;
        } catch {
            return `${SEARCH_ENGINE.google}${i}`;
        }
    }

    private _getWebContent() {
        return this.renderMode === "default" ? this.tabs.current?.webContents : this.window.webContents;
    }

    private async _initServices() {
        await this.services.register("adblocker", new AdblockerService(this), true);
        await this.services.register("protocol", new ProtocolService(this), true);
        await this.services.register("store", new StorageService(this), true);
    }

    private _attachListeners() {
        Object.entries(this.channels).forEach(([name, listener]) => {
            ipcMain.on(name, listener);
        });

        this.window.webContents.on("enter-html-full-screen", () => {
            this.emit("resize");
        });

        this.window.webContents.on("leave-html-full-screen", () => {
            this.emit("resize");
        });

        this.window.on("resized", () => {
            this.emit("resize");
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
        const src = this.source;
        if (src.type === "path") return void this.window.loadFile(src.value);
        this.window.loadURL(src.value);
    }

    public get source() {
        if (this.devMode)
            return {
                value: "http://localhost:3000",
                type: "url"
            } as const;

        return {
            value: `${__dirname}/../dist/index.html`,
            type: "path"
        } as const;
    }

    public create() {
        this.window.show();
        if (this.window.isMaximizable()) this.window.maximize();
        this.tabs.broadcastTabs();
    }

    public close() {
        this._removeListeners();
        for (const [_, v] of this.tabs.cache) {
            this.tabs.destroy(v, false);
        }
        this.window.destroy();
    }

    public send<K extends keyof NobuDispatchChannels>(channel: K, ...args: NobuDispatchChannels[K]) {
        this.window.webContents.send(channel, ...args);
    }

    public setRenderMode(mode: "webview", config: NobuSplitView[] | string | boolean): void;
    public setRenderMode(mode: "protected", config?: INobuInternalPageConfig): void;
    public setRenderMode(mode: "default"): void;
    public setRenderMode(
        mode: NobuRenderMode,
        config?: NobuSplitView[] | INobuInternalPageConfig | string | boolean
    ): void {
        if (mode === "protected") {
            const iconfig = config as INobuInternalPageConfig;
            if (this.tabs.has(iconfig.tabId!)) {
                var tab = this.tabs.get(iconfig.tabId!)!;
                tab.webContents?.setAudioMuted(true);
                tab.remove();
            } else {
                for (const tab of this.tabs.cache.values()) {
                    tab.webContents?.setAudioMuted(true);
                    tab.remove();
                }
            }

            this.renderMode = "protected";

            const pageConfig = {
                id: iconfig.tabId || NobuTab.generateId(),
                page: iconfig.page,
                title: iconfig.page,
                url: `${ProtocolService.List.settings.name}://${iconfig.page}`,
                icon: "/nobu.png"
            } as INobuInternalPage;

            return this.send("create-virtual-tab", pageConfig);
        } else if (mode === "webview") {
            if (this.tabs.has(this.splitViewTabId!)) {
                const tab = this.tabs.get(this.splitViewTabId!)!;
                tab.webContents?.setAudioMuted(true);
                tab.remove();
            } else {
                for (const tab of this.tabs.cache.values()) {
                    tab.webContents?.setAudioMuted(true);
                    tab.remove();
                }
            }

            if (Array.isArray(config) && config.length) {
                this.send("split-view", this.tabs.currentId!, config);
            } else if (typeof config === "string") {
                const screens = getDefaultScreens(config, "all");
                this.send("split-view", this.tabs.currentId!, screens);
            } else if (typeof config === "boolean") {
                if (!config) return this.setRenderMode("default");
                if (this.renderMode === "webview") return this.setRenderMode("default");
                const url = this.tabs.current?.getCurrentURL();
                if (!url) return;
                const screens = getDefaultScreens(url, "all");
                this.send("split-view", this.tabs.currentId!, screens);
            }
            this.renderMode = "webview";
        } else {
            const current = this.tabs.get(this.splitViewTabId!);
            this.splitViewTabId = null;

            this.send("split-view", current?.id || this.tabs.currentId!, []);
            if (current) {
                current.webContents?.setAudioMuted(false);
                current.attach();
            } else {
                for (const tab of this.tabs.cache.values()) {
                    tab.webContents?.setAudioMuted(false);
                    tab.attach();
                }
            }
            this.renderMode = "default";
        }
    }

    public getAllTabs() {
        return this.tabs.getAllTabs();
    }

    public async alert(message: string) {
        await dialog.showMessageBox(this.window, {
            message,
            buttons: ["Ok"],
            title: "Nobu"
        });
    }

    public handleZoomAction(action: "zoom-in" | "zoom-out" | "zoom-reset", id?: string) {
        if (this.renderMode === "default") {
            const tab = id ? this.tabs.get(id) : this.tabs.current;
            if (tab?.webContents) {
                const currentLvl = tab.webContents.getZoomLevel();
                const lvl = action === "zoom-in" ? currentLvl + 1 : action === "zoom-out" ? currentLvl - 1 : 0;
                tab.webContents.setZoomLevel(lvl);
            }
        } else {
            this.send(action, id || this.tabs.currentId!, Date.now());
        }
    }

    public reloadWindow() {
        if (this.renderMode === "default") {
            this.tabs.current?.webContents?.reload();
        } else if (this.renderMode === "webview") {
            this.send("trigger-reload", this.tabs.currentId!);
        } else {
            this.window.webContents.reload();
        }
    }

    public getCurrentSession() {
        return this._getWebContent()?.session || this.getDefaultSession();
    }

    public getDefaultSession() {
        return session.defaultSession;
    }

    public isFullScreen() {
        return this.window.isFullScreen();
    }

    public setFullScreen() {
        if (this.isFullScreen()) return;
        if (this.window.isFullScreenable()) this.window.setFullScreen(true);
    }

    public unsetFullScreen() {
        if (!this.isFullScreen()) return;
    }

    public getDefaultPageURL() {
        const engine = this.services.getService("store").settings.get("searchEngine");

        try {
            const url = new URL(engine);
            return url.origin;
        } catch {
            return engine;
        }
    }

    public reload() {
        this.app.relaunch();
    }
}
