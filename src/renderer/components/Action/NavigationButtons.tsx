import { useEffect, useState } from "react";
import { HistoryBack, HistoryForward, HistoryReload, HistoryReloadCancel } from "./HistoryAction";

interface IProps {
    loading?: boolean;
}

export function NavigationButtons(props: IProps) {
    const [reloading, setReloading] = useState(props.loading || false);
    const [historyPs, setHistoryPs] = useState<HistoryPossibilities>({
        back: false,
        forward: false
    });

    useEffect(() => {
        setReloading(props.loading || false);
    }, [props.loading]);

    useEffect(() => {
        const reloadingListener = () => {
            setReloading(true);
        };

        const reloadedListener = () => {
            setReloading(false);
        };

        const historyListener = (ev: any, p: HistoryPossibilities) => {
            setHistoryPs(p);
        };

        Nobu.on("reloading", reloadingListener);
        Nobu.on("reloaded", reloadedListener);
        Nobu.on("set-history", historyListener);

        return () => {
            Nobu.off("reloading", reloadingListener);
            Nobu.off("reloaded", reloadedListener);
            Nobu.on("set-history", historyListener);
        };
    }, []);

    const handleActions = (t: keyof NobuIncomingChannels) => {
        switch (t) {
            case "page-reload":
            case "history-back":
            case "page-reload-cancel":
            case "history-forward":
                Nobu.send(t);
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
