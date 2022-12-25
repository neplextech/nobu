import { NobuBrowser } from "../NobuBrowser";

export class INobuService {
    public constructor(public nobu: NobuBrowser) {}

    public enable(): Promise<void> | void {
        /* enable */
    }
    public disable(): Promise<void> | void {
        /* disable */
    }
}
