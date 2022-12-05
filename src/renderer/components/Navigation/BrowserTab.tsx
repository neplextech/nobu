import React, { useState } from "react";
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
                ) : props.icon ? (
                    <img src={props.icon} className="h-8 w-8" />
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
