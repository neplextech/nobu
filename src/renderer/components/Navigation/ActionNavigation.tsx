import { useEffect, useState } from "react";
import { VscAdd, VscChromeMaximize, VscExtensions, VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { NavigationButtons } from "../Action/NavigationButtons";
import { NavigationInput } from "../Action/NavigationInput";
import { BrowserTab, BrowserTabProps } from "./BrowserTab";

type ContentType = "multi-render-settings" | "none";

interface IProps {
    onContentSet: (content: ContentType) => void;
    loading?: boolean;
}

export function ActionNavigation(props: IProps) {
    const [tabs, setTabs] = useState<BrowserTabProps[]>([]);

    useEffect(() => {
        Nobu.send("get-tabs");
        const tabsListener = (ev: any, tabs: any) => {
            setTabs((prev) => {
                return tabs.map((m: any) => ({
                    ...m,
                    icon: prev.find((r) => r.id === m.id)?.icon || null
                }));
            });
        };

        Nobu.on("set-tabs", tabsListener);

        return () => Nobu.off("set-tabs", tabsListener);
    }, []);

    return (
        <div className="w-full flex flex-col overflow-hidden top-0 left-0 right-0 fixed h-[10%] bg-inherit">
            {!tabs.length ? null : (
                <div className="mt-2 dark:border-gray-500 border-gray-200">
                    <div className="mx-3 w-full flex place-items-center">
                        {tabs.map((m, i) => {
                            return (
                                <BrowserTab
                                    key={i}
                                    {...m}
                                    onClick={() => {
                                        Nobu.send("set-tab", m.id);
                                    }}
                                />
                            );
                        })}
                        <div className="ml-3 mr-5">
                            <VscAdd
                                className="h-5 w-5 dark:text-white text-black"
                                onClick={() => {
                                    Nobu.send("new-tab");
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="flex space-x-5 p-3 dark:text-white text-black place-items-center w-full dark:bg-xdark-0 bg-xlight-0">
                <NavigationButtons loading={props.loading} />
                <div className="w-[60%]">
                    <NavigationInput />
                </div>
                <div className="flex space-x-2">
                    <VscExtensions
                        className="h-5 w-5 cursor-pointer hover:opacity-70"
                        title="Toggle Multi Rendering Mode"
                        onClick={(ev) => {
                            if (ev.shiftKey) {
                                ev.preventDefault();
                                props.onContentSet?.("multi-render-settings");
                            } else {
                                Nobu.send("set-webview-mode", true);
                            }
                        }}
                    />
                    <VscZoomIn
                        title="Zoom In"
                        className="h-5 w-5 cursor-pointer hover:opacity-70"
                        onClick={() => {
                            Nobu.send("zoom-in");
                        }}
                    />
                    <VscChromeMaximize
                        title="Reset Zoom"
                        className="h-5 w-5 cursor-pointer hover:opacity-70"
                        onClick={() => {
                            Nobu.send("zoom-reset");
                        }}
                    />
                    <VscZoomOut
                        title="Zoom Out"
                        className="h-5 w-5 cursor-pointer hover:opacity-70"
                        onClick={() => {
                            Nobu.send("zoom-out");
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
