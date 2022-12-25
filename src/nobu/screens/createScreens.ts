import { Viewport } from "../structures/Viewport";

type ScreenType = ViewportType | "all";
type FilterFn = (screen: Viewport) => boolean;

export const MobileScreens: Viewport[] = [
    new Viewport({
        name: "iPhone 14",
        width: 390,
        height: 844,
        id: 1,
        pixelRatio: 1,
        type: "mobile",
        default: true
    }),
    new Viewport({
        name: "iPhone 13 Pro Max",
        width: 428,
        height: 926,
        id: 2,
        pixelRatio: 1,
        type: "mobile",
        default: true
    }),
    new Viewport({
        name: "iPhone 8",
        width: 375,
        height: 667,
        id: 3,
        pixelRatio: 1,
        type: "mobile"
    }),
    new Viewport({
        name: "iPhone SE",
        width: 320,
        height: 568,
        id: 4,
        pixelRatio: 1,
        type: "mobile"
    }),
    new Viewport({
        name: "Android Small",
        width: 360,
        height: 640,
        id: 5,
        pixelRatio: 1,
        type: "mobile",
        default: true
    }),
    new Viewport({
        name: "Android Large",
        width: 360,
        height: 800,
        id: 6,
        pixelRatio: 1,
        type: "mobile",
        default: true
    })
];

export const TabletScreens: Viewport[] = [
    new Viewport({
        name: "Surface Pro 8",
        width: 1440,
        height: 960,
        id: 1,
        pixelRatio: 1,
        type: "tablet",
        default: true
    }),
    new Viewport({
        name: "iPad mini 8.3",
        width: 744,
        height: 1133,
        id: 2,
        pixelRatio: 1,
        type: "tablet",
        default: true
    }),
    new Viewport({
        name: 'iPad Pro 11"',
        width: 834,
        height: 1194,
        id: 3,
        pixelRatio: 1,
        type: "tablet"
    }),
    new Viewport({
        name: 'iPad Pro 12.9"',
        width: 1024,
        height: 1366,
        id: 4,
        pixelRatio: 1,
        type: "tablet",
        default: true
    })
];

export const DesktopScreens: Viewport[] = [
    new Viewport({
        name: "Macbook Air",
        width: 1280,
        height: 832,
        id: 1,
        pixelRatio: 1,
        type: "desktop",
        default: true
    }),
    new Viewport({
        name: "Desktop",
        width: 1440,
        height: 1024,
        id: 2,
        pixelRatio: 1,
        type: "desktop",
        default: true
    }),
    new Viewport({
        name: "TV",
        width: 1280,
        height: 720,
        id: 3,
        pixelRatio: 1,
        type: "desktop",
        default: true
    })
];

export function createScreens(url: string, type: ScreenType = "all", filter?: FilterFn): NobuSplitView[] {
    if (type === "all") {
        let screens = MobileScreens.concat(TabletScreens, DesktopScreens);
        if (filter) screens = screens.filter(filter);
        return screens.map((m) => {
            m.setURL(url);
            return m.toJSON();
        });
    }

    let screens = type === "mobile" ? MobileScreens : TabletScreens;
    if (filter) screens = screens.filter(filter);
    return screens.map((m) => {
        m.setURL(url);
        return m.toJSON();
    });
}

export function getDefaultScreens(url: string, type: ScreenType = "all"): NobuSplitView[] {
    return createScreens(url, type, (s) => !!s.isDefault());
}
