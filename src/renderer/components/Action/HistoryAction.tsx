import { TfiArrowLeft, TfiArrowRight } from "react-icons/tfi";
import { VscChromeClose, VscRefresh } from "react-icons/vsc";

interface IProps {
    onClick?: () => void;
    disabled?: boolean;
}

export function HistoryBack({ onClick, disabled }: IProps) {
    return (
        <TfiArrowLeft
            className={`h-5 w-5${disabled ? " text-gray-500" : ""}`}
            onClick={disabled ? undefined : onClick}
        />
    );
}

export function HistoryReload({ onClick }: IProps) {
    return <VscRefresh className="h-5 w-5" onClick={onClick} />;
}

export function HistoryReloadCancel({ onClick }: IProps) {
    return <VscChromeClose className="h-5 w-5" onClick={onClick} />;
}

export function HistoryForward({ onClick, disabled }: IProps) {
    return (
        <TfiArrowRight
            className={`h-5 w-5${disabled ? " text-gray-500" : ""}`}
            onClick={disabled ? undefined : onClick}
        />
    );
}
