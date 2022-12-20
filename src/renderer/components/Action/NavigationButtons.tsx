import { useEffect, useState } from "react";
import { HistoryBack, HistoryForward, HistoryReload, HistoryReloadCancel } from "./HistoryAction";
import { useTab } from "../../hooks/useTab";
import { receiver } from "../../utils/nobu";

interface IProps {
    loading?: boolean;
    onClick?: () => void;
}

export function NavigationButtons(props: IProps) {
    const [reloading, setReloading] = useState(props.loading || false);
    const [historyPs, setHistoryPs] = useState<HistoryPossibilities>({
        back: false,
        forward: false
    });

    const { current } = useTab();

    useEffect(() => {
        setReloading(props.loading || false);
    }, [props.loading]);

    useEffect(() => {
        const historyListener = receiver("set-history", (_, id, history) => {
            if (id !== current.id) return;
            setHistoryPs(history);
        });

        return () => historyListener.destroy();
    }, []);

    const handleActions = (t: keyof NobuIncomingChannels) => {
        switch (t) {
            case "page-reload":
            case "history-back":
            case "page-reload-cancel":
            case "history-forward":
                props.onClick?.();
                Nobu.send(t, current.id);
                break;
        }
    };

    return (
        <div className="flex space-x-4 dark:text-white text-black">
            <HistoryBack
                disabled={!historyPs.back}
                onClick={() => {
                    handleActions("history-back");
                }}
            />
            {reloading ? (
                <HistoryReloadCancel
                    onClick={() => {
                        handleActions("page-reload-cancel");
                    }}
                />
            ) : (
                <HistoryReload
                    onClick={() => {
                        handleActions("page-reload");
                    }}
                />
            )}
            {!historyPs.forward ? null : (
                <HistoryForward
                    onClick={() => {
                        handleActions("history-forward");
                    }}
                />
            )}
        </div>
    );
}
