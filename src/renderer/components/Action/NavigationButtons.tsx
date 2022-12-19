import { useEffect, useState } from "react";
import { HistoryBack, HistoryForward, HistoryReload, HistoryReloadCancel } from "./HistoryAction";

interface IProps {
    loading?: boolean;
    forward?: boolean;
    backward?: boolean;
    onClick?: () => void;
}

export function NavigationButtons(props: IProps) {
    const [reloading, setReloading] = useState(props.loading || false);
    const [historyPs, setHistoryPs] = useState<HistoryPossibilities>({
        back: props.backward || false,
        forward: props.forward || false
    });

    useEffect(() => {
        setReloading(props.loading || false);
        setHistoryPs({ back: !!props.backward, forward: !!props.forward });
    }, [props.loading, props.forward, props.backward]);

    const handleActions = (t: keyof NobuIncomingChannels) => {
        switch (t) {
            case "page-reload":
            case "history-back":
            case "page-reload-cancel":
            case "history-forward":
                props.onClick?.();
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
