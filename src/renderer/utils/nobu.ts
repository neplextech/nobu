export function receiver<K extends keyof NobuDispatchChannels>(
    event: K,
    handler: (ev: Electron.IpcRendererEvent, ...args: NobuDispatchChannels[K]) => any
) {
    Nobu.on(event, handler);

    return {
        destroy: () => Nobu.off(event, handler)
    };
}
