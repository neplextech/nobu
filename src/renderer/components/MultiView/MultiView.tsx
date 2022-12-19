import { useEffect, useRef, useState } from "react";
import { VscChromeMaximize, VscInspect, VscLoading, VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { WebView, WebViewTagElement } from "./WebView";

interface IProps {
    pages: NobuSplitView[];
    phone?: boolean;
    onStartLoading?: () => void;
    onStopLoading?: () => void;
}

export function MultiView(props: IProps) {
    const { pages, phone, onStartLoading, onStopLoading } = props;

    return (
        <div className="overflow-auto mb-[70px]">
            <div className={`grid ${phone ? "lg:grid-cols-3 grid-cols-1" : "grid-cols-1"} gap-2`}>
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
    data: NobuSplitView;
    onStartLoading?: () => void;
    onStopLoading?: () => void;
}

type InternalWebviewAction = "open-devtools" | "zoom-in" | "zoom-out" | "zoom-reset" | "reload" | "cancel-reload";

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
                    console.log(webview.openDevTools());
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
            case "cancel-reload":
                webview.stop();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const zoomInlistener = (_: any, n: number) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-in");
        };
        const zoomResetlistener = (_: any, n: number) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-reset");
        };
        const zoomOutlistener = (_: any, n: number) => {
            if (globalNonceStore.has(n)) return;
            globalNonceStore.add(n);
            execAction("zoom-out");
        };

        const triggerReloadListener = (_: any) => {
            execAction("reload");
        };

        const cancelReloadListener = (_: any) => {
            execAction("cancel-reload");
        };

        Nobu.on("zoom-in", zoomInlistener);
        Nobu.on("zoom-reset", zoomResetlistener);
        Nobu.on("zoom-out", zoomOutlistener);
        Nobu.on("trigger-reload", triggerReloadListener);
        Nobu.on("cancel-reload", cancelReloadListener);

        return () => {
            Nobu.off("zoom-in", zoomInlistener);
            Nobu.off("zoom-reset", zoomResetlistener);
            Nobu.off("zoom-out", zoomOutlistener);
            Nobu.off("trigger-reload", triggerReloadListener);
            Nobu.off("cancel-reload", cancelReloadListener);
        };
    }, []);

    return (
        <div>
            <div className={`flex space-x-2`}>
                <h1 className="text-sm">
                    {data.name || `Screen-${data.id}`} | ({data.height}x{data.width})
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
                onLoadStart={() => onStartLoading?.()}
                onDidStopLoading={() => onStopLoading?.()}
                useragent={data.userAgent || undefined}
                className="border dark:border-gray-500 border-gray-300 bg-slate-300"
            ></WebView>
        </div>
    );
}
