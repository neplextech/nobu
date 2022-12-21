import { BrowserView } from "electron";
import { NobuBrowser } from "../NobuBrowser";
import { randomUUID } from "crypto";
import { createContextMenu } from "../menu/contextMenu";

interface INobuTabConfig {
    renderer: NobuRenderMode;
}

interface WebContentEvents {
    "will-navigate": (event: Electron.Event, url: string) => any;
    "did-navigate-in-page": (event: Electron.Event, url: string) => any;
    "did-finish-load": (event: Electron.Event) => any;
    "did-stop-loading": (event: Electron.Event) => any;
    "did-start-loading": (event: Electron.Event) => any;
    "page-title-updated": (event: Electron.Event, title: string) => any;
    "page-favicon-updated": (event: Electron.Event, icons: string[]) => any;
    "context-menu": (event: Electron.Event, params: Electron.ContextMenuParams) => any;
}

export class NobuTab {
    public url!: string;
    public favicon!: string;
    public title!: string;
    public id = randomUUID();
    public view: BrowserView | null = null;
    private __resizeListener = () => this.resize();
    private __readyListener = () => {
        if (this.active) {
            this.attach();
            this.resize();
        }
    }

    private _channels = Object.entries({
        "did-finish-load": (event) => {
            if (!this.view) return;
            this.nobu.send("reloaded", this.id);
            this.nobu.tabs.broadcastTabs();
        },
        "did-navigate-in-page": (event, url) => {
            this.setURL(url);
            this.nobu.tabs.broadcastTabs();
        },
        "did-start-loading": (event) => {
            this.nobu.send("reloading", this.id);
            this.nobu.tabs.broadcastTabs();
        },
        "did-stop-loading": (event) => {
            this.setURL(this.getCurrentURL()!);
            this.nobu.send("reloaded", this.id);
            this.nobu.tabs.broadcastTabs();
        },
        "page-title-updated": (event, title) => {
            this.setTitle(title);
            this.nobu.tabs.broadcastTabs();
        },
        "will-navigate": (event, url) => {
            this.setURL(url);
            this.nobu.tabs.broadcastTabs();
        },
        "page-favicon-updated": (event, icons) => {
            if (icons.length) {
                this.setFavicon(icons[0]);
                this.nobu.send("set-favicon", this.id, icons[0]);
                this.nobu.tabs.broadcastTabs();
            }
        },
        "context-menu": (event, p) => {
            if (!this.view) return;

            createContextMenu({
                ...p,
                view: this.view,
                nobu: this.nobu
            });
        }
    } as WebContentEvents);

    public constructor(public nobu: NobuBrowser, public config: INobuTabConfig) {
        if (this.config.renderer === "default") {
            this.view = this._initBrowserView();
            this._attachListeners();
            this.nobu.on("resize", this.__resizeListener);
            this.nobu.on("ready", this.__readyListener);
        }
    }

    private _initBrowserView() {
        const view = new BrowserView();
        view.setAutoResize({
            width: true,
            height: true
        });

        this._resize(view);

        return view;
    }

    private _attachListeners() {
        if (!this.view) return;
        const view = this.view;
        this._channels.forEach(([name, listener]) => {
            view.webContents.on(name as any, listener);
        });
        view.webContents.setWindowOpenHandler((details) => {
            this.nobu.tabs.openInNewTab(details.url, details.referrer);
            return { action: "deny" };
        });
    }

    private _removeListeners() {
        if (!this.view) return;

        const view = this.view;

        this._channels.forEach(([name, listener]) => {
            view.webContents.off(name as any, listener);
        });
    }

    private _resize(view: BrowserView, size?: number) {
        size ??= this.getSpacingSize();
        const bound = this.nobu.window.getBounds();
        // view.setAutoResize({
        //     height: true,
        //     width: true,
        //     horizontal: true
        // });
        view.setBounds({ x: 0, y: size, width: bound.width, height: bound.height - size });
    }

    public getSpacingSize() {
        if (this.nobu.isFullScreen()) return this.nobu.SPACING_FULLSCREEN;
        return this.nobu.CLIENT_SPACING;
    }

    public getRendererType() {
        return this.config.renderer;
    }

    public isWebview() {
        return this.getRendererType() === "webview";
    }

    public isDefault() {
        return this.getRendererType() === "default";
    }

    public isBrowserView() {
        return this.getRendererType() === "default";
    }

    public setURL(url: string) {
        if (!url) return;
        this.url = url;
        this.nobu.send("set-url", this.id, this.url);
    }

    public setFavicon(ico: string) {
        if (!ico) return;
        this.favicon = ico;
        this.nobu.send("set-favicon", this.id, this.favicon);
    }

    public setTitle(title: string) {
        if (!title) return;
        this.title = title;
        this.nobu.send("set-title", this.id, this.title);
    }

    public resize(size?: number) {
        if (this.view) return this._resize(this.view, size);
        this.nobu.off("resize", this.__resizeListener);
    }

    public close() {
        if (this.view) {
            this.remove();
            (this.view.webContents as any).destroy?.();
            this.view = null;

            this.nobu.tabs.cache.delete(this.id);
        }
    }

    public getHistoryPossibilities() {
        if (!this.webContents) return { back: false, forward: false };
        return {
            back: this.webContents.canGoBack(),
            forward: this.webContents.canGoForward()
        };
    }

    public emitHistoryPossibilities() {
        this.nobu.send("set-history", this.id, this.getHistoryPossibilities());
    }

    public emitCurrentURL() {
        if (this.view) return this.nobu.send("set-url", this.id, this.getCurrentURL()!);
    }

    public getCurrentURL() {
        return this.view?.webContents.getURL() || this.url;
    }

    public attach() {
        if (!this.view) return;
        try {
            this.nobu.window.addBrowserView(this.view);
        } catch { }
    }

    public remove() {
        if (!this.view) return;
        this._removeListeners();
        try {
            this.nobu.window.removeBrowserView(this.view);
        } catch { }
    }

    public get webContents() {
        if (this.view) return this.view.webContents;
        return null;
    }

    public getTitle() {
        return this.view?.webContents.getTitle() || this.title || null;
    }

    public goForward() {
        if (this.webContents?.canGoForward()) return this.webContents?.goForward();
    }

    public goBack() {
        if (this.webContents?.canGoBack()) return this.webContents?.goBack();
    }

    public get active() {
        return this.nobu.tabs.currentId === this.id;
    }

    public isFocused() {
        return this.active;
    }

    public focus() {
        this.nobu.tabs.setCurrentTab(this);
    }
}
