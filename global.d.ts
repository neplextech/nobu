import type { IpcMainEvent, IpcRendererEvent } from "electron";

declare global {
    type NobuMainListener<T> = (event: IpcMainEvent, ...args: T) => any;

    interface INobuURLSetPayload {
        tab: number;
        url: string;
    }

    interface NobuDispatchChannels {
        "set-title": [string];
        "set-url": [INobuURLSetPayload];
        "set-history": [HistoryPossibilities];
        "set-favicon": [string];
        reloading: [];
        reloaded: [];
        "set-tabs": [NobuDispatchedTab[]];
        "remove-webviews": [];
        "add-webviews": [NobuSplitView[]];
        "set-webview-url": [string];
        "zoom-in": [number];
        "zoom-reset": [number];
        "zoom-out": [number];
        "trigger-reload": [];
        "cancel-reload": [];
        "network-offline-emulation": [boolean];
        "network-error": [NobuSessionNetworkError | null];
        "split-view": [NobuSplitView[] | null];
    }

    interface NobuSessionNetworkError {
        error: string;
        code: number;
        url: string;
        method: string;
    }

    interface NobuDispatchedTab {
        id: number;
        active: boolean;
        title: string;
        loading: boolean;
        url: string;
    }

    interface NobuNavigationAddress {
        address: string;
        tab: number;
    }

    interface NobuIncomingChannels {
        "history-back": [];
        "history-forward": [];
        "page-reload": [];
        "page-reload-cancel": [];
        navigate: [NobuNavigationAddress];
        "new-tab": [];
        "close-tab": [number];
        "set-tab": [number];
        "get-tabs": [];
        "get-url": [];
        "set-splitview-mode": [NobuSplitView[] | null | boolean];
        "zoom-in": [];
        "zoom-reset": [];
        "zoom-out": [];
        "network-offline-emulation": [boolean];
        "open-multiview-settings": [];
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
}

export {};
