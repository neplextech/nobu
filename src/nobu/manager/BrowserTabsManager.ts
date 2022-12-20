import { BrowserView } from "electron";
import { createContextMenu } from "../menu/contextMenu";
import { NobuBrowser } from "../NobuBrowser";
import { NobuTab } from "../structures/NobuTab";
import { Collection } from "@discordjs/collection";

type TabResolvable = string | NobuTab;

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
        const tab = this.new(false, "browserview");
        this.setCurrentTab(tab);
        tab.resize();
        if (tab.webContents)
            tab.webContents.loadURL(url, {
                httpReferrer: referrer
            });
    }

    public broadcastTabs() {
        if (!this.cache.size) return;

        const tabs = [...this.cache.values()];
        const tabArray = tabs.map((view) => ({
            id: view.id,
            active: this.current?.id === view.id,
            title: view.getTitle() || "",
            loading: !!view.webContents?.isLoading(),
            url: view.webContents?.getURL() || ""
        }));

        this.nobu.send("set-tabs", tabArray);
    }

    public new(disableBroadcast = false, renderMode = this.nobu.renderMode) {
        const tab = new NobuTab(this.nobu, {
            renderer: renderMode
        });
        if (!disableBroadcast) this.broadcastTabs();
        return tab;
    }

    public setCurrentTab(tabLike: TabResolvable) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;
        if (this.current) {
            this.current.remove();
            this.lastTabId = this.current.id;
        }

        tab.attach();
        tab.resize();
        tab.emitCurrentURL();
        this.broadcastTabs();
        this.currentId = tab.id;
    }

    public destroy(tabLike: TabResolvable, exit = false) {
        const tab = this.resolveTab(tabLike);
        if (!tab) return;

        const nextTab = this.cache.find((r) => r.id === this.lastTabId || r.id !== tab.id);
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
