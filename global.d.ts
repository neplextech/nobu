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
    }

    interface NobuIncomingChannelsHandler {
        "history-back": NobuMainListener<NobuIncomingChannels["history-back"]>;
        "history-forward": NobuMainListener<NobuIncomingChannels["history-forward"]>;
        "page-reload": NobuMainListener<NobuIncomingChannels["page-reload"]>;
        "page-reload-cancel": NobuMainListener<NobuIncomingChannels["page-reload-cancel"]>;
        navigate: NobuMainListener<NobuIncomingChannels["navigate"]>;
        "new-tab": NobuMainListener<NobuIncomingChannels["new-tab"]>;
        "close-tab": NobuMainListener<NobuIncomingChannels["close-tab"]>;
        "set-tab": NobuMainListener<NobuIncomingChannels["set-tab"]>;
        "get-tabs": NobuMainListener<NobuIncomingChannels["get-tabs"]>;
        "get-url": NobuMainListener<NobuIncomingChannels["get-url"]>;
    }

    interface HistoryPossibilities {
        back: boolean;
        forward: boolean;
    }
}

export {};
