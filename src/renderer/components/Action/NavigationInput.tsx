import { useState, useEffect } from "react";

export function NavigationInput() {
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        const pageUrlFn = (ev: any, u: string) => {
            setPageUrl(u);
        };

        Nobu.on("set-url", pageUrlFn);

        return () => {
            Nobu.off("set-url", pageUrlFn);
        };
    }, []);

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
        <input
            type="text"
            placeholder="Search or enter web address"
            className="w-full dark:bg-xdark bg-xlight p-1 px-5 rounded-full focus:outline dark:focus:outline-gray-500 focus:outline-gray-300"
            onKeyUp={(e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    if (!e.currentTarget.value) return;
                    handleNavigation(e.currentTarget.value);
                }
            }}
            autoCorrect="false"
            autoCapitalize="false"
            autoComplete="false"
            autoFocus={false}
            autoSave="false"
            value={pageUrl}
            onChange={(e) => {
                setPageUrl(e.currentTarget.value);
            }}
        />
    );
}
