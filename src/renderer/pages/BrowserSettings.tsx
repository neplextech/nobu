import { useEffect, useRef, useState } from "react";
import { receiver } from "../utils/nobu";
import { VscLoading } from "react-icons/vsc";

export function BrowserSettings() {
    const [settings, setSettings] = useState<NobuBrowserSetting | null>(null);
    const searchEngineRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const settingL = receiver("nobu-settings", (_, data) => {
            setSettings(data);
        });

        Nobu.send("get-settings");

        return () => {
            settingL.destroy();
        };
    }, []);

    const saveSettings = () => {
        const newSettings = Object.assign({}, settings);

        const searchEngine = searchEngineRef.current;
        if (searchEngine?.value) newSettings.searchEngine = searchEngine.value;

        Nobu.send("set-settings", newSettings);
    };

    return (
        <div className="dark:text-white light:text-black p-4 h-screen">
            <h1 className="text-3xl">Nobu Settings</h1>
            <div className="p-5 dark:border-xlight border-xdark border my-4 rounded-lg w-[50%]">
                {!settings ? (
                    <VscLoading className="animate-spin text-blue-500 h-12 w-12" />
                ) : (
                    <>
                        <div className="mb-5">
                            <h1 className="text-lg">Search Engine</h1>
                            <select
                                ref={searchEngineRef}
                                className="form-select rounded-md block w-[30%] dark:bg-xdark-1 bg-xlight-1"
                                defaultValue={settings.searchEngine}
                            >
                                <option value="" disabled>
                                    --Select One--
                                </option>
                                <option value="bing">Bing</option>
                                <option value="brave">Brave</option>
                                <option value="duckduckgo">DuckDuckGo</option>
                                <option value="ecosia">Ecosia</option>
                                <option value="google">Google</option>
                                <option value="mojeek">Mojeek</option>
                                <option value="presearch">Presearch</option>
                                <option value="qwant">Qwant</option>
                                <option value="startpage">Startpage</option>
                                <option value="yahoo">Yahoo</option>
                            </select>
                        </div>
                        <button
                            className="p-2 w-[30%] bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400"
                            onClick={saveSettings}
                        >
                            Save
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
