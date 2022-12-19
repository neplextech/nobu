import { NobuBrowser } from "../NobuBrowser";
import { reactiveSetter } from "../utils/reactiveSetter";

export class NobuTab {
    public url!: string;
    public favicon!: string;
    public title!: string;

    public constructor(public nobu: NobuBrowser, public readonly id: number) {
        reactiveSetter(this, ["url", "favicon", "title"], (key, val) => {
            this.nobu.send(`set-${key}`, val);
        });
    }

    public setURL(url: string) {
        this.url = url;
    }

    public setFavicon(ico: string) {
        this.favicon = ico;
    }

    public setTitle(title: string) {
        this.title = title;
    }
}