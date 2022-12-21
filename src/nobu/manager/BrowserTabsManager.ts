import { BrowserView } from "electron";
import { createContextMenu } from "../menu/contextMenu";
import { NobuBrowser } from "../NobuBrowser";
import { NobuTab } from "../structures/NobuTab";
import { Collection } from "@discordjs/collection";

type TabResolvable = string | NobuTab;

interface NobuTabCreateProps {
    offscreen?: boolean;
    disableBroadcast?: boolean;
    renderMode?: NobuRenderMode;
}

export class BrowserTabsManager {
    public lastTabId: string | null = null;
    public currentId: string | null = null;
    public cache = new Collection<string, NobuTab>();

    public constructor(public nobu: NobuBrowser) {}

    public get current() {
        if (!this.currentId) return null;
        return this.cache.get(this.currentId);
    }

    public openInNewTab(url: string, referrer?: string | Electron.Referrer) {
        const tab = this.new({
            renderMode: "default"
        });
        tab.focus();
        tab.resize();
        if (tab.webContents)
            tab.webContents.loadURL(url, {
                httpReferrer: referrer
            });
    }

    public broadcastTabs() {
        if (!this.cache.size) return;

        const tabArray = this.cache.map((view) => {
            view.emitHistoryPossibilities();
            return {
                id: view.id,
                active: view.active,
                title: view.getTitle() || "",
                loading: !!view.webContents?.isLoading(),
                url: view.webContents?.getURL() || "",
                icon: view.favicon
            };
        });

        this.nobu.send("set-tabs", tabArray);
    }

    public new(props: NobuTabCreateProps = {}) {
        const {
            disableBroadcast = false,
            renderMode = this.nobu.renderMode,
            offscreen = false
        } = props;
        const tab = new NobuTab(this.nobu, {
            renderer: renderMode
        });
        if (!this.cache.size) {
            this.setCurrentTab(tab, offscreen);
        }
        this.lastTabId = tab.id;
        this.cache.set(tab.id, tab);
        if (!disableBroadcast) this.broadcastTabs();
        return tab;
    }

    public setCurrentTab(tabLike: TabResolvable, offscreen = false) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;
        if (this.current) {
            this.current.remove();
            this.lastTabId = this.current.id;
        }

        if (!offscreen) {
            tab.attach();
            tab.resize();
        }
        tab.emitCurrentURL();
        this.currentId = tab.id;
        this.broadcastTabs();
    }

    public destroy(tabLike: TabResolvable, exit = false) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;

        const nextTab = this.cache.find((r) => r.id === this.lastTabId || r.id !== tab.id) || this.cache.first();
        if (nextTab) this.setCurrentTab(nextTab);

        tab.close();
        this.cache.delete(tab.id);

        if (this.cache.size < 1) {
            if (exit) this.nobu.window.destroy();
        } else {
            this.broadcastTabs();
        }
    }

    public resolveTab(tabLike: TabResolvable): NobuTab | undefined {
        if (typeof tabLike === "string") {
            return this.cache.get(tabLike);
        }

        return tabLike;
    }

    public getAllTabs() {
        return [...this.cache.values()];
    }

    public get(id: string) {
        return this.cache.get(id);
    }

    public has(id: string) {
        return this.cache.has(id);
    }

    public delete(id: string) {
        return this.cache.delete(id);
    }

    public set(id: string, tab: NobuTab) {
        return this.cache.set(id, tab);
    }
}
