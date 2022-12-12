import { BrowserView, WebContents } from "electron";
import { createContextMenu } from "../menu/ContextMenu";
import { NobuBrowser } from "../NobuBrowser";
import { AdblockerService } from "../services/AdblockerService";

type TabResolvable = number | BrowserView;
interface WCEvents {
    "will-navigate": (event: Electron.Event, url: string) => any;
    "did-navigate-in-page": (event: Electron.Event, url: string) => any;
    "did-finish-load": (event: Electron.Event) => any;
    "did-stop-loading": (event: Electron.Event) => any;
    "did-start-loading": (event: Electron.Event) => any;
    "page-title-updated": (event: Electron.Event, title: string) => any;
    "page-favicon-updated": (event: Electron.Event, icons: string[]) => any;
    "context-menu": (event: Electron.Event, params: Electron.ContextMenuParams) => any;
}

export class BrowserTabsManager {
    public tabs: number[] = [];
    public views: Record<number, BrowserView> = {};
    public current: BrowserView | null = null;
    private _channels = Object.entries({
        "did-finish-load": (event) => {
            this.nobu.send("reloaded");
            this.emitCurrentURL();
            this.emitHistoryPossibilities();
            this.broadcastTabs();
        },
        "did-navigate-in-page": (event, url) => {
            this.emitCurrentURL();
            this.emitHistoryPossibilities();
        },
        "did-start-loading": (event) => {
            this.nobu.send("reloading");
            this.emitCurrentURL();
            this.emitHistoryPossibilities();
            this.broadcastTabs();
        },
        "did-stop-loading": (event) => {
            this.emitCurrentURL();
            this.nobu.send("reloaded");
            this.emitHistoryPossibilities();
            this.broadcastTabs();
        },
        "page-title-updated": (event, title) => {
            this.nobu.send("set-title", title);
            this.broadcastTabs();
        },
        "will-navigate": (event, url) => {
            this.nobu.send("set-url", url);
            this.broadcastTabs();
        },
        "page-favicon-updated": (event, icons) => {
            if (icons.length) {
                this.nobu.send("set-favicon", icons[0]);
                this.broadcastTabs();
            }
        },
        "context-menu": (event, p) => {
            if (!this.current) return;

            createContextMenu({
                ...p,
                view: this.current,
                nobu: this.nobu
            });
        }
    } as WCEvents);
    public constructor(public nobu: NobuBrowser) {}

    private _attachListeners(view: BrowserView) {
        this._channels.forEach(([name, listener]) => {
            view.webContents.on(name as any, listener);
        });
        view.webContents.setWindowOpenHandler((details) => {
            this.openInNewTab(details.url, details.referrer);
            return { action: "deny" };
        });
    }

    private _attachServices(view: Electron.BrowserView) {
        const adblocker = this.nobu.services.getService<AdblockerService>("adblocker");
        if (adblocker.isBlockerAvailable()) {
            adblocker.addSession(view.webContents.session);
        }
    }

    private _removeListeners(view: BrowserView) {
        this._channels.forEach(([name, listener]) => {
            view.webContents.off(name as any, listener);
        });
    }

    public openInNewTab(url: string, referrer?: string | Electron.Referrer) {
        const tab = this.new();
        this.setCurrentTab(tab);
        this.resize(tab);
        tab.webContents.loadURL(url, {
            httpReferrer: referrer
        });
    }

    public getCurrentURL() {
        return this.current?.webContents.getURL();
    }

    public broadcastTabs() {
        if (!Object.keys(this.views).length) return;

        const tabs = Object.values(this.views);
        const tabArray = tabs.map((view) => ({
            id: view.webContents.id,
            active: this.current?.webContents.id === view.webContents.id,
            title: view.webContents.getTitle(),
            loading: view.webContents.isLoading(),
            url: view.webContents.getURL()
        }));

        this.nobu.send("set-tabs", tabArray);
    }

    public new(disableBroadcast = false) {
        const view = new BrowserView();
        view.setAutoResize({ width: true, height: true });
        this.tabs.push(view.webContents.id);
        this.views[view.webContents.id] = view;
        if (this.current) this.remove(this.current);
        this.current = view;
        this.resize(view);
        this.attach(this.current);
        this._attachServices(view);
        if (!disableBroadcast) this.broadcastTabs();
        return view;
    }

    public attach(tabLike: TabResolvable, addAsCurrent = true) {
        const tab = this.resolveTab(tabLike);
        if (tab) {
            this._attachListeners(tab);
            this.nobu.window.addBrowserView(tab);
            if (addAsCurrent) this.current = tab;
            // tab.webContents.focus();
        }
    }

    public remove(tabLike: TabResolvable) {
        const tab = this.resolveTab(tabLike);
        if (tab) {
            this._removeListeners(tab);
            this.nobu.window.removeBrowserView(tab);
            // this.current = null;
        }
    }

    public setCurrentTab(tabLike: TabResolvable) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;
        if (this.current) this.remove(this.current);
        this.attach(tab);
        this.resize(tab);
        this.emitCurrentURL();
        this.broadcastTabs();
    }

    public delete(tabLike: TabResolvable, exit = false) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;

        const nextTab = Object.values(this.views).find((r) => r.webContents.id !== tab.webContents.id);
        if (nextTab) this.setCurrentTab(nextTab);

        const id = tab.webContents.id;
        this.tabs = this.tabs.filter((t) => t !== id);
        this._removeListeners(tab);
        (tab.webContents as any).destroy?.();
        delete this.views[id];
        if (Object.keys(this.views).length < 1) {
            if (exit) this.nobu.window.destroy();
        } else {
            this.broadcastTabs();
        }
    }

    public resolveTab(tabLike: TabResolvable): BrowserView | undefined {
        if (typeof tabLike === "number") {
            return this.views[tabLike];
        }

        return tabLike;
    }

    public resize(tabLike: TabResolvable, size: number = this.nobu.SPACING_TABS) {
        const tab = this.resolveTab(tabLike);
        if (tab) {
            const bound = this.nobu.window.getBounds();
            tab.setBounds({ x: 0, y: size, width: bound.width, height: bound.height - size });
        }
    }

    public emitHistoryPossibilities() {
        if (!this.current) return;
        const canGoBack = this.current.webContents.canGoBack();
        const canGoForward = this.current.webContents.canGoForward();

        this.nobu.send("set-history", {
            back: canGoBack,
            forward: canGoForward
        });
    }

    public emitCurrentURL() {
        const url = this.getCurrentURL();
        if (url) this.nobu.send("set-url", url);
    }

    public getAllViews() {
        return Object.values(this.views);
    }
}
