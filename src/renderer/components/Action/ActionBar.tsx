import { VscAdd, VscExtensions } from "react-icons/vsc";
import { BrowserTab } from "../Tabs/BrowserTab";
import { NavigationButtons } from "../Action/NavigationButtons";
import { AddressBar } from "../Action/AddressBar";
import { formatAddress } from "../../utils/formatAddress";
import { useTab } from "../../hooks/useTab";

export function ActionBar() {
    const { current, tabs } = useTab();
    if (!tabs.length) return <></>;

    const handleAddressSubmit = (address: string) => {
        if (address) {
            Nobu.send("navigate", current.id, formatAddress(address));
        }
    };

    return (
        <div className="w-full flex flex-col overflow-hidden top-0 left-0 right-0 fixed h-auto max-h-28 bg-inherit">
            {!tabs.length ? null : (
                <div className="mt-2 dark:border-gray-500 border-gray-200">
                    <div className="mx-4 w-full flex place-items-center">
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
                <NavigationButtons
                    loading={current.loading}
                    onClick={() => {
                        if (current) Nobu.send("set-tab", current.id);
                    }}
                />
                <div className="w-[60%]">
                    <AddressBar current={current} onSubmit={handleAddressSubmit} />
                </div>
                <div className="flex space-x-2">
                    <VscExtensions
                        className="h-5 w-5 cursor-pointer hover:opacity-70"
                        title="Toggle Multi Rendering Mode"
                        onClick={(ev) => {
                            if (ev.shiftKey) {
                                ev.preventDefault();
                                Nobu.send("open-multiview-settings");
                            } else {
                                Nobu.send("set-splitview-mode", current.id, true);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
