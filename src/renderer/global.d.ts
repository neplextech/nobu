declare global {
    declare var Nobu: typeof import("../nobu/preload/main").NobuBrowserContext;
    type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
}

export {};
