import { VscAdd, VscExtensions, VscGear } from "react-icons/vsc";
import { BrowserTab } from "../Tabs/BrowserTab";
import { NavigationButtons } from "../Action/NavigationButtons";
import { AddressBar } from "../Action/AddressBar";
import { formatAddress } from "../../utils/formatAddress";
import { useTab } from "../../hooks/useTab";
import { forwardRef, useEffect, useRef } from "react";

interface IProps {
    setTabs: React.Dispatch<React.SetStateAction<NobuDispatchedTab[]>>;
}

export const ActionBar = (props: IProps) => {
    const { setTabs } = props;
    const { current, tabs } = useTab();

    const actionBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Nobu.send("__$ready");
    }, []);

    useEffect(() => {
        const action = actionBarRef.current;
        if (!action) return;
        Nobu.send("__$ch", action.clientHeight + 25, action.parentElement?.clientHeight ?? -1);
    }, [actionBarRef.current?.clientHeight]);

    const handleAddressSubmit = (address: string) => {
        if (address) {
            Nobu.send("navigate", current.id, formatAddress(address));
        }
    };

    return (
        <div
            ref={actionBarRef}
            className="w-full flex flex-col overflow-hidden top-0 left-0 right-0 fixed h-auto max-h-28 bg-inherit"
        >
            {!tabs.length ? null : (
                <>
                    <div className="mt-2 dark:border-gray-500 border-gray-200 draggable">
                        <div className="mx-4 w-full flex place-items-center">
                            {tabs.map((m, i) => {
                                return (
                                    <BrowserTab
                                        key={i}
                                        {...m}
                                        onClick={() => {
                                            if (current.virtual)
                                                return void setTabs((prev) =>
                                                    prev.map((m) => ({
                                                        ...m,
                                                        active: m.id === current.id
                                                    }))
                                                );
                                            Nobu.send("set-tab", m.id);
                                        }}
                                        onClose={(id) => {
                                            if (current.virtual) {
                                                setTabs((prev) => prev.filter((r) => r.id === current.id));
                                                Nobu.send("__$internal", null);
                                                return;
                                            }
                                            Nobu.send("close-tab", id);
                                        }}
                                    />
                                );
                            })}
                            <div className="ml-3 mr-5">
                                <VscAdd
                                    className="h-5 w-5 dark:text-white text-black undraggable"
                                    onClick={() => {
                                        Nobu.send("new-tab");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-5 p-3 dark:text-white text-black place-items-center w-full dark:bg-xdark-0 bg-xlight-0 undraggable">
                        <NavigationButtons
                            loading={current?.loading}
                            onClick={() => {
                                if (current) Nobu.send("set-tab", current.id);
                            }}
                        />
                        <div className="w-[60%]">
                            <AddressBar current={current} onSubmit={handleAddressSubmit} />
                        </div>
                        {current.virtual ? null : (
                            <div className="flex space-x-2">
                                <VscExtensions
                                    className="h-5 w-5 cursor-pointer hover:opacity-70"
                                    title="Toggle Multi Rendering Mode"
                                    onClick={(ev) => {
                                        if (ev.shiftKey) {
                                            ev.preventDefault();
                                            Nobu.send("__$internal", { page: "multiview-settings" });
                                        } else {
                                            Nobu.send("set-splitview-mode", current.id, true);
                                        }
                                    }}
                                />
                                <VscGear
                                    className="h-5 w-5 cursor-pointer hover:opacity-70"
                                    title="Settings"
                                    onClick={(ev) => {
                                        Nobu.send("__$internal", { page: "settings" });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
