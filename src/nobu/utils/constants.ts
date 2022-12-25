import { app } from "electron";

export const NOBU_GITHUB = "https://github.com/neplextech/nobu" as const;

export const SEARCH_ENGINE = {
    bing: "https://www.bing.com/search?q=",
    brave: "https://search.brave.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
    ecosia: "https://www.ecosia.org/search?q=",
    google: "https://www.google.com/search?q=",
    mojeek: "https://www.mojeek.com/search?q=",
    presearch: "https://presearch.com/search?q=",
    qwant: "https://www.qwant.com/?q=",
    startpage: "https://www.startpage.com/search?q=",
    yahoo: "https://search.yahoo.com/search?q="
} as const;

export const USER_AGENT = app.userAgentFallback.replace(/Electron\/.+\s/, "");
