import { SEARCH_ENGINE } from "./constants";

export function resolveSearchEngine(src: string) {
    const engine = src as keyof typeof SEARCH_ENGINE;

    if (engine in SEARCH_ENGINE) return SEARCH_ENGINE[engine];
    return SEARCH_ENGINE.brave;
}

export function resolveSearchEngineName(src: string) {
    const res = Object.entries(SEARCH_ENGINE);

    return res.find((r) => r[1] === src)?.[0];
}
