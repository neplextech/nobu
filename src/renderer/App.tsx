import { useEffect, useState } from "react";
import { MultiView } from "./components/MultiView/MultiView";
import { WebView } from "./components/MultiView/WebView";
import { ActionNavigation } from "./components/Navigation/ActionNavigation";

export default function App() {
    const [webviewPages, setWebviewPages] = useState<WebViewModeConfig[]>([]);

    useEffect(() => {
        Nobu.on("add-webviews", (ev, data) => {
            setWebviewPages(data);
        });

        Nobu.on("remove-webviews", () => {
            setWebviewPages([]);
        });

        return () => {
            Nobu.off("add-webviews");
            Nobu.off("remove-webviews");
        };
    }, []);

    return (
        <div className="dark:bg-xdark bg-xlight overflow-hidden">
            <ActionNavigation />
            <div className={"h-screen select-none bg-inherit overflow-auto"}>
                {webviewPages.length ? (
                    <div>
                        {!webviewPages.length ? null : (
                            <div className="w-full max-h-full">
                                {webviewPages.length === 1 ? (
                                    <WebView
                                        style={{
                                            height: webviewPages[0].height
                                        }}
                                        src={webviewPages[0].url}
                                    />
                                ) : (
                                    <MultiView pages={webviewPages} />
                                )}
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
