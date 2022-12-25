import { useEffect, useRef, useState } from "react";
import { VscChromeMaximize, VscInspect, VscLoading, VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { WebView, WebViewTagElement } from "./WebView";
import { receiver } from "../../utils/nobu";
import { formatAddress } from "../../utils/formatAddress";

interface IProps {
    pages: (NobuSplitView & { tabId: string })[];
    phone?: boolean;
    onStartLoading?: () => void;
    onStopLoading?: () => void;
}

export function MultiView(props: IProps) {
    const { pages, phone = false, onStartLoading, onStopLoading } = props;

    return (
        <div className="overflow-auto mb-[70px]">
            <div className={`grid ${phone ? "lg:grid-cols-3 grid-cols-1" : "grid-cols-1"} gap-2 mb-5`}>
                {pages.map((m, i) => {
                    return (
                        <InternalView data={m} key={i} onStartLoading={onStartLoading} onStopLoading={onStopLoading} />
                    );
                })}
            </div>
        </div>
    );
}

interface InternalProps {
    data: NobuSplitView & { tabId: string };
    onStartLoading?: () => void;
    onStopLoading?: () => void;
}

type InternalWebviewAction =
    | "open-devtools"
    | "zoom-in"
    | "zoom-out"
    | "zoom-reset"
    | "reload"
    | "cancel-reload"
    | "back"
    | "forward";

const globalNonceStore = new Set<number>();

export function InternalView(props: InternalProps) {
    const { data, onStartLoading, onStopLoading } = props;
    const currentViewRef = useRef<WebViewTagElement>(null);

    const execAction = (action: InternalWebviewAction) => {
        const webview = currentViewRef.current;
        if (!webview) return;

        switch (action) {
            case "open-devtools":
                {
                    if (!webview.isDevToolsOpened()) webview.openDevTools();
                }
                break;
            case "zoom-out":
            case "zoom-reset":
            case "zoom-in":
                {
                    if (action === "zoom-reset") return webview.setZoomLevel(0);

                    const inc = action === "zoom-in";

                    webview.setZoomLevel(inc ? webview.getZoomLevel() + 1 : webview.getZoomLevel() - 1);
                }
                break;
            case "reload":
                webview.reload();
                break;
            case "back":
                if (webview.canGoBack()) webview.goBack();
                break;
            case "forward":
                if (webview.canGoForward()) webview.reload();
                break;
            case "cancel-reload":
                webview.stop();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const zoomInlistener = receiver("zoom-in", (_, id, n) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-in");
        });
        const zoomResetlistener = receiver("zoom-reset", (_, id, n) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-reset");
        });
        const zoomOutlistener = receiver("zoom-out", (_, id, n) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-out");
        });

        const triggerReloadListener = receiver("trigger-reload", () => {
            execAction("reload");
        });

        const triggerBackListener = receiver("trigger-back", () => {
            execAction("back");
        });

        const triggerForwardListener = receiver("trigger-forward", () => {
            execAction("forward");
        });

        const cancelReloadListener = receiver("cancel-reload", () => {
            execAction("cancel-reload");
        });

        return () => {
            zoomInlistener.destroy();
            zoomOutlistener.destroy();
            zoomResetlistener.destroy();
            triggerReloadListener.destroy();
            triggerBackListener.destroy();
            triggerForwardListener.destroy();
            cancelReloadListener.destroy();
        };
    }, []);

    return (
        <div>
            <div className={`flex space-x-2`}>
                <h1 className="text-sm">
                    {data.name || `Screen-${data.id}`} | ({data.width}x{data.height})
                </h1>
                <div className="flex space-x-2">
                    <VscInspect
                        className="h-4 w-4 text-blue-400 cursor-pointer"
                        onClick={() => {
                            execAction("open-devtools");
                        }}
                    />
                </div>
            </div>
            <WebView
                ref={currentViewRef}
                src={data.url}
                style={{
                    width: data.cw,
                    height: data.ch
                }}
                onWillNavigate={(ev) => {
                    Nobu.send("navigate", data.tabId, formatAddress(ev.url));
                }}
                onDidNavigateInPage={(ev) => {
                    // in-page navigations have some problems
                    Nobu.send("navigate", data.tabId, formatAddress(ev.url));
                }}
                onPageTitleUpdated={(ev) => {
                    Nobu.send("set-title", data.tabId, ev.title);
                }}
                onPageFaviconUpdated={(ev) => {
                    Nobu.send("set-favicon", data.tabId, ev.favicons[0]);
                }}
                onDidStartLoading={() => {
                    Nobu.send("set-loading", data.tabId, true);
                }}
                onDidStopLoading={() => {
                    Nobu.send("set-loading", data.tabId, false);
                }}
                // useragent={data.userAgent || undefined}
                className="border dark:border-gray-500 border-gray-300 bg-slate-300"
            ></WebView>
        </div>
    );
}
