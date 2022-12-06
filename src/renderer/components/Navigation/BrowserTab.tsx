import React, { useEffect, useState } from "react";
import { VscClose, VscLoading } from "react-icons/vsc";

export interface BrowserTabProps {
    title: string;
    id: number;
    active?: boolean;
    loading?: boolean;
    icon?: string | null;
    onClick?: () => any;
}

export function BrowserTab(props: BrowserTabProps) {
    const [favicon, setFavicon] = useState(props.icon || "");

    useEffect(() => {
        if (props.icon) setFavicon(props.icon);
    }, [props.icon]);

    useEffect(() => {
        const favListener = (ev: any, icon: string) => {
            if (icon) setFavicon(icon);
        };

        Nobu.on("set-favicon", favListener);

        return () => Nobu.off("set-favicon", favListener);
    }, []);

    return (
        <div
            onClick={props.onClick}
            className={`flex flex-1 max-w-xs items-center justify-between text-white px-3 py-2 rounded-t-md ${
                props.active ? "bg-xdark-0" : "hover:bg-xdark-0 hover:bg-opacity-70"
            }`}
        >
            <div className="flex space-x-3 w-[90%] place-items-center">
                {props.loading ? (
                    <VscLoading className="text-blue-500 h-5 w-5 animate-spin" />
                ) : favicon ? (
                    <img src={favicon} className="h-4 w-4" alt="" onError={() => {}} />
                ) : null}
                <span className="block text-sm truncate text-left" title={props.title}>
                    {props.title}
                </span>
            </div>
            <VscClose
                className="h-5 w-5 bg-xdark-0"
                onClick={() => {
                    Nobu.send("close-tab", props.id);
                }}
            />
        </div>
    );
}
