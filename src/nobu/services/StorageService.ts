import { SEARCH_ENGINE } from "../utils/constants";
import { INobuService } from "./AbstractService";
import Store, { Schema } from "electron-store";

const NobuSettingsSchema = {
    searchEngine: {
        default: SEARCH_ENGINE.google,
        type: "string"
    }
} as Schema<NobuBrowserSetting>;

export class StorageService extends INobuService {
    public settings = new Store({
        schema: NobuSettingsSchema
    });

    public enable(): void | Promise<void> {
        // TODO: attach listener
        return Promise.resolve();
    }

    public disable(): void | Promise<void> {
        // TODO: remove listener
        return Promise.resolve();
    }
}
