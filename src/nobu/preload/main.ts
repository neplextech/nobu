import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

type EventListener = (event: IpcRendererEvent, ...args: any[]) => void;

export const NobuBrowserContext = {
    on(channel: string, listener: EventListener) {
        ipcRenderer.on(channel, listener);
    },

    once(channel: string, listener: EventListener) {
        ipcRenderer.once(channel, listener);
    },

    off(channel: string, listener: EventListener) {
        ipcRenderer.off(channel, listener);
    },

    send(channel: string, ...message: any[]) {
        ipcRenderer.send(channel, ...message);
    }
};

contextBridge.exposeInMainWorld("Nobu", NobuBrowserContext);
