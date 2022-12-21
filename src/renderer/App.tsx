import { useEffect, useRef, useState } from "react";
import { receiver } from "./utils/nobu";
import { ActionBar } from "./components/Action/ActionBar";
import { ContentArea } from "./components/Content/ContentArea";
import { NobuTabContext } from "./context/TabContext";

export default function App() {
    const [tabs, setTabs] = useState<NobuDispatchedTab[]>([]);
    const [currentTab, setCurrentTab] = useState<NobuDispatchedTab | null>(null);
    const [splitView, setSplitView] = useState<(NobuSplitView & { tabId: string })[]>([]);
    const actionBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Nobu.send("get-tabs");
    }, []);

    useEffect(() => {
        const current = tabs.find((r) => r.active) || tabs[0];
        if (current) document.title = current.title || "Nobu Browser";
        setCurrentTab(current || null);
    }, [tabs]);

    useEffect(() => {
        const action = actionBarRef.current;
        if (!action) return;
        Nobu.send("__$ch", action.clientHeight, action.parentElement?.clientHeight ?? -1);
    }, [actionBarRef.current?.clientHeight]);

    useEffect(() => {
        const tabsListener = receiver("set-tabs", (_, tabs) => {
            setTabs(tabs);
        });
        const addressRec = receiver("set-url", (_, id, url) => {
            if (tabs.some((tab) => tab.id === id)) {
                setTabs((prev) =>
                    prev.map((m) => ({
                        ...m,
                        url: m.id === id ? url : m.url
                    }))
                );
            }
        });

        const splitListener = receiver("split-view", (_, id, data) => {
            if (!Array.isArray(data)) return setSplitView([]);

            setSplitView(
                data.map((m) => ({
                    ...m,
                    tabId: id
                }))
            );
        });

        const wvUrlListener = receiver("set-webview-url", (_, id, url) => {
            setSplitView((p) => p.map((m) => ({ ...m, url: m.tabId === id ? url : m.url })));
        });

        return () => {
            tabsListener.destroy();
            addressRec.destroy();
            splitListener.destroy();
            wvUrlListener.destroy();
        };
    }, []);

    return (
        <NobuTabContext.Provider
            value={{
                current: currentTab!,
                tabs
            }}
        >
            <div className="dark:bg-xdark select-none bg-xlight overflow-hidden flex flex-col space-y-28 max-h-screen">
                <ActionBar ref={actionBarRef} />
                {currentTab ? <ContentArea tab={currentTab} split={splitView} /> : null}
            </div>
        </NobuTabContext.Provider>
    );
}
