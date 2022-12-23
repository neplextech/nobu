import { SEARCH_ENGINE } from "./constants";

export function resolveSearchEngine(src: string) {
    const engine = src as keyof typeof SEARCH_ENGINE;

    switch (engine) {
        case "google":
        case "bing":
        case "duckduckgo":
        case "ecosia":
            return SEARCH_ENGINE[engine];
        default:
            return SEARCH_ENGINE.google;
    }
}

export function resolveSearchEngineName(src: string) {
    const res = Object.entries(SEARCH_ENGINE);

    return res.find((r) => r[1] === src)?.[0];
}
