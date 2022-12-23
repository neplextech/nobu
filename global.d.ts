import type { IpcMainEvent, IpcRendererEvent } from "electron";

declare global {
    type NobuMainListener<T> = (event: IpcMainEvent, ...args: T) => any;

    interface NobuDispatchChannels {
        "set-title": [string, string];
        "set-url": [string, string];
        "set-history": [string, HistoryPossibilities];
        "set-favicon": [string, string];
        reloading: [string];
        reloaded: [string];
        "set-tabs": [NobuDispatchedTab[]];
        "remove-webviews": [string];
        "add-webviews": [string, NobuSplitView[]];
        "set-webview-url": [string, string];
        "zoom-in": [string, number];
        "zoom-reset": [string, number];
        "zoom-out": [string, number];
        "trigger-reload": [string];
        "trigger-back": [string];
        "trigger-forward": [string];
        "cancel-reload": [string];
        "network-offline-emulation": [boolean];
        "network-error": [NobuSessionNetworkError | null];
        "split-view": [string, NobuSplitView[]];
        "create-virtual-tab": [INobuInternalPage];
        "nobu-settings": [NobuBrowserSetting];
    }

    interface NobuSessionNetworkError {
        error: string;
        code: number;
        url: string;
        method: string;
    }

    interface NobuDispatchedTab {
        id: string;
        active: boolean;
        title: string;
        loading: boolean;
        url: string;
        icon?: string;
        virtual?: boolean;
        page?: NobuInternalPage;
    }

    interface NobuBrowserSetting {
        searchEngine: string;
    }

    type NobuInternalPage = "settings" | "multiview-settings";

    interface INobuInternalPageConfig {
        page: NobuInternalPage;
        tabId?: string;
    }

    interface INobuInternalPage {
        page: NobuInternalPage;
        id: string;
        title: string;
        url: string;
        icon?: string;
    }

    type NavigationData = string | { search: string };

    interface NobuIncomingChannels {
        "history-back": [string];
        "history-forward": [string];
        "page-reload": [string];
        "page-reload-cancel": [string];
        navigate: [string, NavigationData];
        "new-tab": [];
        "close-tab": [string];
        "set-tab": [string];
        "get-tabs": [];
        "get-url": [string];
        "set-splitview-mode": [string, NobuSplitView[] | null | boolean];
        "zoom-in": [string];
        "zoom-reset": [string];
        "zoom-out": [string];
        "network-offline-emulation": [boolean];
        "open-multiview-settings": [];
        __$ch: [number, number];
        __$ready: [];
        "set-loading": [string, boolean];
        "set-favicon": [string, string];
        "set-title": [string, string];
        __$internal: [INobuInternalPageConfig | null];
        "get-settings": [];
        "set-settings": [NobuBrowserSetting];
    }

    interface NobuSplitView {
        url: string;
        height: number;
        width: number;
        ch: number;
        cw: number;
        name?: string;
        id: number;
        userAgent?: string;
        type: "tablet" | "mobile";
    }

    type NobuIncomingChannelsHandler = {
        [K in keyof NobuIncomingChannels]: NobuMainListener<NobuIncomingChannels[K]>;
    };

    interface HistoryPossibilities {
        back: boolean;
        forward: boolean;
    }

    type NobuRenderMode = "webview" | "default" | "protected";
}

export {};
