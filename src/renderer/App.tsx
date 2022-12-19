import { useEffect, useState } from "react";
import { receiver } from "./utils/nobu";
import { ActionBar } from "./components/Action/ActionBar";
import { ContentArea } from "./components/Content/ContentArea";

export default function App() {
    const [tabs, setTabs] = useState<NobuDispatchedTab[]>([]);
    const [currentTab, setCurrentTab] = useState<NobuDispatchedTab | null>(null);
    const [splitView, setSplitView] = useState<NobuSplitView[] | null>(null);

    useEffect(() => {
        const current = tabs.find((r) => r.active) || tabs[0];
        setCurrentTab(current || null);
    }, [tabs]);

    useEffect(() => {
        const tabsListener = receiver("set-tabs", (_, tabs) => {
            setTabs(tabs);
        });
        const addressRec = receiver("set-url", (_, data) => {
            if (tabs.some((tab) => tab.id === data.tab)) {
                setTabs((prev) =>
                    prev.map((m) => ({
                        ...m,
                        url: m.id === data.tab ? data.url : m.url
                    }))
                );
            }
        });

        const splitListener = receiver("split-view", (_, data) => {
            setSplitView(data);
        });

        return () => {
            tabsListener.destroy();
            addressRec.destroy();
            splitListener.destroy();
        };
    }, []);

    return (
        <div className="dark:bg-xdark select-none bg-xlight overflow-hidden flex flex-col space-y-28 max-h-screen">
            <ActionBar tabs={tabs} current={currentTab} />
            {currentTab ? <ContentArea tab={currentTab} split={splitView} /> : null}
        </div>
    );
}
