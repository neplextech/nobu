import { useEffect, useState } from "react";
import { MultiView } from "./components/MultiView/MultiView";
import { WebView } from "./components/MultiView/WebView";
import { ActionNavigation } from "./components/Navigation/ActionNavigation";
import { MultiRender } from "./components/Settings/MultiRender";

export default function App() {
    const [webviewPages, setWebviewPages] = useState<WebViewModeConfig[]>([]);
    const [mobileViews, setMobileViews] = useState<WebViewModeConfig[]>([]);
    const [tabletViews, setTabletViews] = useState<WebViewModeConfig[]>([]);
    const [showMultiRenderSettingPage, setShowMultiRenderSettingPage] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);

    useEffect(() => {
        setMobileViews(webviewPages.filter((r) => r.type === "mobile"));
        setTabletViews(webviewPages.filter((r) => r.type === "tablet"));
    }, [webviewPages]);

    useEffect(() => {
        Nobu.on("add-webviews", (ev, data) => {
            setShowMultiRenderSettingPage(false);
            setWebviewPages(data);
        });

        Nobu.on("remove-webviews", () => {
            setShowMultiRenderSettingPage(false);
            setWebviewPages([]);
        });

        Nobu.on("set-webview-url", (ev, url) => {
            setWebviewPages((p) => p.map((m) => ({ ...m, url })));
        });

        return () => {
            Nobu.off("add-webviews");
            Nobu.off("remove-webviews");
            Nobu.off("set-webview-url");
        };
    }, []);

    return (
        <div className="dark:bg-xdark select-none bg-xlight overflow-hidden flex flex-col space-y-28 max-h-screen">
            <ActionNavigation
                loading={isContentLoading}
                onContentSet={(c) => {
                    switch (c) {
                        case "multi-render-settings":
                            setShowMultiRenderSettingPage(true);
                            break;
                        case "none":
                            setShowMultiRenderSettingPage(false);
                        default:
                            break;
                    }
                }}
            />
            <div className={"h-screen select-none bg-inherit overflow-auto px-5"}>
                {showMultiRenderSettingPage ? (
                    <MultiRender />
                ) : webviewPages.length ? (
                    <div className="w-full dark:text-white light:text-black">
                        <h1 className="text-3xl text-center">Multi Screen Preview</h1>
                        {webviewPages.length === 1 ? (
                            <WebView
                                style={{
                                    height: webviewPages[0].height
                                }}
                                src={webviewPages[0].url}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-5">
                                <div>
                                    <h1 className="text-lg">Mobile Screens</h1>
                                    <MultiView
                                        pages={mobileViews}
                                        phone
                                        onStartLoading={() => {
                                            setIsContentLoading(true);
                                        }}
                                        onStopLoading={() => {
                                            setIsContentLoading(false);
                                        }}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-lg">Tablet Screens</h1>
                                    <MultiView
                                        pages={tabletViews}
                                        onStartLoading={() => {
                                            setIsContentLoading(true);
                                        }}
                                        onStopLoading={() => {
                                            setIsContentLoading(false);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
