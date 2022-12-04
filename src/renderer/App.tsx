import { useEffect, useState } from "react";
import { TfiArrowLeft, TfiArrowRight } from "react-icons/tfi";
import { VscRefresh } from "react-icons/vsc";

export default function App() {
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        console.log(Nobu, "Nobu Context");
        const pageUrlFn = (ev: any, u: string) => {
            console.log("wop", u, ev);
            setPageUrl(u);
        };
        Nobu.on("set-page-url", pageUrlFn);

        return () => {
            Nobu.off("set-page-url", pageUrlFn);
        };
    }, []);

    const handleActions = (t: "back" | "reload" | "forward") => {
        switch (t) {
            case "reload":
                Nobu.send("reload");
                break;
            case "back":
                Nobu.send("back");
                break;
            case "forward":
                Nobu.send("forward");
                break;
        }
    };

    const handleNavigation = (u: string) => {
        let url: string;

        try {
            url = new URL(u).href;
        } catch {
            url = `https://www.google.com/search?q=${encodeURIComponent(u)}`;
        }

        Nobu.send("navigate", url);
    };

    return (
        <div className="h-screen bg-xdark-1">
            <div className="flex space-x-5 p-3 bg-xdark-0 text-white place-items-center">
                <div className="flex space-x-4 text-white">
                    <TfiArrowLeft
                        className="h-5 w-5"
                        onClick={() => {
                            handleActions("back");
                        }}
                    />
                    <VscRefresh
                        className="h-5 w-5"
                        onClick={() => {
                            handleActions("reload");
                        }}
                    />
                    <TfiArrowRight
                        className="h-5 w-5"
                        onClick={() => {
                            handleActions("forward");
                        }}
                    />
                </div>
                <div className="w-[70%]">
                    <input
                        type="text"
                        placeholder="Search or enter web address"
                        className="w-full bg-xdark p-1 px-5 rounded-full focus:outline-1 focus:outline-gray-800"
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                if (!e.currentTarget.value) return;
                                handleNavigation(e.currentTarget.value);
                            }
                        }}
                        value={pageUrl}
                        onChange={(e) => {
                            setPageUrl(e.currentTarget.value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
