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
    private __unsubSettingSubscription!: Function;
    public settings = new Store({
        schema: NobuSettingsSchema
    });

    public enable() {
        this.__unsubSettingSubscription = this.settings.onDidAnyChange((newData) => {
            if (newData) this.nobu.send("nobu-settings", newData);
        });
    }

    public disable() {
        this.__unsubSettingSubscription?.();
    }
}
