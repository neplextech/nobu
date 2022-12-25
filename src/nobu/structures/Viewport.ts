import { USER_AGENT } from "../utils/constants";

interface ViewportInit {
    name: string;
    width: number;
    height: number;
    userAgent?: string;
    type: ViewportType;
    id: number;
    pixelRatio: number;
    url?: string;
    default?: boolean;
}

export class Viewport {
    public url = this.data.url;
    public constructor(public data: ViewportInit) {}

    public isDefault() {
        return !!this.data.default;
    }

    public get pixelRatio() {
        return this.data.pixelRatio;
    }

    public setURL(url: string) {
        this.url = url;
        return this.url;
    }

    public get id() {
        return this.data.id;
    }

    public get width() {
        return this.data.width;
    }

    public get height() {
        return this.data.height;
    }

    public get name() {
        return this.data.name;
    }

    public get type() {
        return this.data.type;
    }

    public isMobile() {
        return this.type === "mobile";
    }

    public isDesktop() {
        return this.type === "desktop";
    }

    public isTablet() {
        return this.type === "tablet";
    }

    public isCustom() {
        return this.type === "custom";
    }

    public getUserAgent() {
        return this.data.userAgent || USER_AGENT;
    }

    public cssHeight() {
        return this.data.height / this.data.pixelRatio;
    }

    public cssWidth() {
        return this.data.width / this.data.pixelRatio;
    }

    public toJSON(): NobuSplitView {
        return {
            width: this.data.width,
            height: this.data.height,
            ch: this.cssHeight(),
            cw: this.cssWidth(),
            id: this.data.id,
            type: this.data.type,
            name: this.data.name,
            url: this.url!,
            userAgent: this.getUserAgent()
        };
    }

    public toString() {
        return `${this.name} (${this.width}x${this.height})`;
    }
}
