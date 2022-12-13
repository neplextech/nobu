import type { IpcMainEvent, IpcRendererEvent } from "electron";

declare global {
    type NobuMainListener<T> = (event: IpcMainEvent, ...args: T) => any;

    interface NobuDispatchChannels {
        "set-title": [string];
        "set-url": [string];
        "set-history": [HistoryPossibilities];
        "set-favicon": [string];
        reloading: [];
        reloaded: [];
        "set-tabs": [NobuDispatchedTab[]];
        "remove-webviews": [];
        "add-webviews": [WebViewModeConfig[]];
        "set-webview-url": [string];
    }

    interface NobuDispatchedTab {
        id: number;
        active: boolean;
        title: string;
        loading: boolean;
    }

    interface NobuIncomingChannels {
        "history-back": [];
        "history-forward": [];
        "page-reload": [];
        "page-reload-cancel": [];
        navigate: [string];
        "new-tab": [];
        "close-tab": [number];
        "set-tab": [number];
        "get-tabs": [];
        "get-url": [];
        "set-webview-mode": [WebViewModeConfig[]];
    }

    interface WebViewModeConfig {
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
}

export {};
