import React, { useEffect } from "react";

export const WEBVIEW_EVENTS = [
    "load-commit",
    "did-finish-load",
    "did-fail-load",
    "did-frame-finish-load",
    "did-start-loading",
    "did-stop-loading",
    "did-attach",
    "dom-ready",
    "page-title-updated",
    "page-favicon-updated",
    "enter-html-full-screen",
    "leave-html-full-screen",
    "console-message",
    "found-in-page",
    "will-navigate",
    "did-start-navigation",
    "did-redirect-navigation",
    "did-navigate",
    "did-frame-navigate",
    "did-navigate-in-page",
    "ipc-message",
    "crashed",
    "plugin-crashed",
    "destroyed",
    "media-started-playing",
    "media-paused",
    "did-change-theme-color",
    "update-target-url",
    "devtools-opened",
    "devtools-closed",
    "devtools-focused",
    "context-menu"
] as const;

interface IWebviewTag {
    onLoadCommit(event: Electron.LoadCommitEvent): void;
    onDidFinishLoad(event: Electron.Event): void;
    onDidFailLoad(event: Electron.DidFailLoadEvent): void;
    onDidFrameFinishLoad(event: Electron.DidFrameFinishLoadEvent): void;
    onDidStartLoading(event: Electron.Event): void;
    onDidStopLoading(event: Electron.Event): void;
    onDidAttach(event: Electron.Event): void;
    onDomReady(event: Electron.Event): void;
    onPageTitleUpdated(event: Electron.PageTitleUpdatedEvent): void;
    onPageFaviconUpdated(event: Electron.PageFaviconUpdatedEvent): void;
    onEnterHtmlFullScreen(event: Electron.Event): void;
    onLeaveHtmlFullScreen(event: Electron.Event): void;
    onConsoleMessage(event: Electron.ConsoleMessageEvent): void;
    onFoundInPage(event: Electron.FoundInPageEvent): void;
    onWillNavigate(event: Electron.WillNavigateEvent): void;
    onDidStartNavigation(event: Electron.DidStartNavigationEvent): void;
    onDidRedirectNavigation(event: Electron.DidRedirectNavigationEvent): void;
    onDidNavigate(event: Electron.DidNavigateEvent): void;
    onDidFrameNavigate(event: Electron.DidFrameNavigateEvent): void;
    onDidNavigateInPage(event: Electron.DidNavigateInPageEvent): void;
    onClose(event: Electron.Event): void;
    onIpcMessage(event: Electron.IpcMessageEvent): void;
    onCrashed(event: Electron.Event): void;
    onPluginCrashed(event: Electron.PluginCrashedEvent): void;
    onDestroyed(event: Electron.Event): void;
    onMediaStartedPlaying(event: Electron.Event): void;
    onMediaPaused(event: Electron.Event): void;
    onDidChangeThemeColor(event: Electron.DidChangeThemeColorEvent): void;
    onUpdateTargetUrl(event: Electron.UpdateTargetUrlEvent): void;
    onDevtoolsOpened(event: Electron.Event): void;
    onDevtoolsClosed(event: Electron.Event): void;
    onDevtoolsFocused(event: Electron.Event): void;
    onContextMenu(event: Electron.ContextMenuEvent): void;
    canGoBack(): boolean;
    canGoForward(): boolean;
    canGoToOffset(offset: number): boolean;
    capturePage(rect?: Electron.Rectangle): Promise<Electron.NativeImage>;
    clearHistory(): void;
    closeDevTools(): void;
    copy(): void;
    cut(): void;
    delete(): void;
    downloadURL(url: string): void;
    executeJavaScript(code: string, userGesture?: boolean): Promise<any>;
    findInPage(text: string, options?: Electron.FindInPageOptions): number;
    getTitle(): string;
    getURL(): string;
    getUserAgent(): string;
    getWebContentsId(): number;
    getZoomFactor(): number;
    getZoomLevel(): number;
    goBack(): void;
    goForward(): void;
    goToIndex(index: number): void;
    goToOffset(offset: number): void;
    insertCSS(css: string): Promise<string>;
    insertText(text: string): Promise<void>;
    inspectElement(x: number, y: number): void;
    inspectServiceWorker(): void;
    inspectSharedWorker(): void;
    isAudioMuted(): boolean;
    isCrashed(): boolean;
    isCurrentlyAudible(): boolean;
    isDevToolsFocused(): boolean;
    isDevToolsOpened(): boolean;
    isLoading(): boolean;
    isLoadingMainFrame(): boolean;
    isWaitingForResponse(): boolean;
    loadURL(url: string, options?: Electron.LoadURLOptions): Promise<void>;
    openDevTools(): void;
    paste(): void;
    pasteAndMatchStyle(): void;
    print(options?: Electron.WebviewTagPrintOptions): Promise<void>;
    printToPDF(options: Electron.PrintToPDFOptions): Promise<Uint8Array>;
    redo(): void;
    reload(): void;
    reloadIgnoringCache(): void;
    removeInsertedCSS(key: string): Promise<void>;
    replace(text: string): void;
    replaceMisspelling(text: string): void;
    selectAll(): void;
    send(channel: string, ...args: any[]): Promise<void>;
    sendInputEvent(
        event: Electron.MouseInputEvent | Electron.MouseWheelInputEvent | Electron.KeyboardInputEvent
    ): Promise<void>;
    sendToFrame(frameId: [number, number], channel: string, ...args: any[]): Promise<void>;
    setAudioMuted(muted: boolean): void;
    setUserAgent(userAgent: string): void;
    setVisualZoomLevelLimits(minimumLevel: number, maximumLevel: number): Promise<void>;
    setZoomFactor(factor: number): void;
    setZoomLevel(level: number): void;
    showDefinitionForSelection(): void;
    stop(): void;
    stopFindInPage(action: "clearSelection" | "keepSelection" | "activateSelection"): void;
    undo(): void;
    unselect(): void;
    allowpopups: boolean;
    disableblinkfeatures: string;
    disablewebsecurity: boolean;
    enableblinkfeatures: string;
    httpreferrer: string;
    nodeintegration: boolean;
    nodeintegrationinsubframes: boolean;
    partition: string;
    plugins: boolean;
    preload: string;
    src: string;
    useragent: string;
    webpreferences: string;
    ref: React.LegacyRef<IWebviewTag & HTMLWebViewElement> | undefined;
}

type WebViewTagProps = IWebviewTag & React.HTMLAttributes<Electron.WebviewTag>;

export type WebViewTagElement = IWebviewTag & HTMLWebViewElement;

function transformCase(s: string): string {
    const result = s
        .replace("on", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    return result.split(" ").join("-").toLowerCase().trim();
}

export const WebView = React.forwardRef(
    (props: Partial<WebViewTagProps>, ref: React.ForwardedRef<HTMLWebViewElement>) => {
        const id = `$$__webview-${Date.now()}__$$`;
        const events: { name: string; handler: Function }[] = [];

        const newProp: typeof props = Object.assign({}, props);
        Object.keys(props).forEach((prop) => {
            if (!prop.startsWith("on")) return;
            const propVal = prop as keyof typeof props;
            const native = transformCase(propVal);
            if (WEBVIEW_EVENTS.some((r) => r === native)) {
                const value = props[propVal];
                delete newProp[propVal];
                events.push({
                    name: native,
                    handler: value
                });
            }
        });

        Object.preventExtensions(newProp);

        useEffect(() => {
            const el = document.getElementById(id);
            if (el) {
                events.forEach((ev) => {
                    // @ts-expect-error
                    el.addEventListener(ev.name, ev.handler);
                });
            }

            return () => {
                if (el) {
                    events.forEach((ev) => {
                        // @ts-expect-error
                        el.removeEventListener(ev.name, ev.handler);
                    });
                }
            };
        }, []);

        return <webview id={id} ref={ref} onError={() => {}} {...newProp} />;
    }
);
