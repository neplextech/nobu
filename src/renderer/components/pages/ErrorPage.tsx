import { MdWifiOff } from "react-icons/md";

interface IProps {
    details: NobuSessionNetworkError;
}

export function ErrorPage(props: IProps) {
    return (
        <div className="flex items-center justify-center space-y-4 dark:text-white flex-col">
            <MdWifiOff className="h-28 w-28" />
            <h1 className="text-xl">Request Failed</h1>
            <p className="text-base">Error: {props.details.error}</p>
            <p className="text-sm">
                Code: {props.details.code} | Method: {props.details.method}
            </p>
            <button
                className="p-2 bg-slate-400 hover:bg-slate-500 cursor-pointer rounded-md"
                onClick={() => {
                    Nobu.send("page-reload");
                }}
            >
                Reload
            </button>
        </div>
    );
}
