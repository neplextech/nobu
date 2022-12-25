/* eslint-disable @typescript-eslint/no-explicit-any */

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

ipcRenderer.setMaxListeners(Infinity);

export const NobuBrowserContext = {
    on<K extends keyof NobuDispatchChannels>(
        channel: K,
        listener: (ev: IpcRendererEvent, ...args: NobuDispatchChannels[K]) => any
    ) {
        ipcRenderer.on(channel, listener as any);
    },

    once<K extends keyof NobuDispatchChannels>(
        channel: K,
        listener: (ev: IpcRendererEvent, ...args: NobuDispatchChannels[K]) => any
    ) {
        ipcRenderer.once(channel, listener as any);
    },

    off<K extends keyof NobuDispatchChannels>(
        channel: K,
        listener?: (ev: IpcRendererEvent, ...args: NobuDispatchChannels[K]) => any
    ) {
        if (listener) {
            ipcRenderer.off(channel, listener as any);
        } else {
            ipcRenderer.removeAllListeners(channel);
        }
    },

    send<K extends keyof NobuIncomingChannels>(channel: K, ...message: NobuIncomingChannels[K]) {
        ipcRenderer.send(channel as unknown as string, ...(message as any[]));
    }
};

contextBridge.exposeInMainWorld("Nobu", NobuBrowserContext);
