declare global {
    // eslint-disable-next-line no-var
    declare var Nobu: typeof import("../nobu/preload/main").NobuBrowserContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
}

export {};
