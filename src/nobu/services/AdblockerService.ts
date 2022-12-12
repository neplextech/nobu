import { INobuService } from "./AbstractService";
import { ElectronBlocker } from "@cliqz/adblocker-electron";
import { fetch } from "cross-fetch";
import { app, session } from "electron";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export class AdblockerService extends INobuService {
    private _blocker!: ElectronBlocker;
    public LOCATION = `${app.getAppPath()}/.nobu_services` as const;
    private _isEnabled = false;

    private async _initializeBlocker() {
        try {
            if (!this._blocker)
                this._blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch, {
                    path: `${this.LOCATION}/adblocker.service.bin`,
                    read: readFile,
                    write: writeFile
                });
            return true;
        } catch {
            return false;
        }
    }

    public async enable() {
        if (!existsSync(this.LOCATION)) {
            await mkdir(this.LOCATION, { recursive: true }).catch(() => false);
        }
        const didInitialize = await this._initializeBlocker();
        if (!didInitialize || !this._blocker) return;
        this.addSession(session.defaultSession);
        // this.nobu.getAllTabs().forEach((view) => {
        //     this.addSession(view.webContents.session);
        // });
        this._isEnabled = true;
    }

    public disable() {
        if (!this._blocker) return;
        this.removeSession(session.defaultSession);
        // this.nobu.getAllTabs().forEach((view) => {
        //     this.removeSession(view.webContents.session);
        // });
        this._isEnabled = false;
    }

    public addSession(session: Electron.Session) {
        if (this.isEnabledFor(session)) return;
        this._blocker.enableBlockingInSession(session);
    }

    public removeSession(session: Electron.Session) {
        if (!this.isEnabledFor(session)) return;
        this._blocker.disableBlockingInSession(session);
    }

    public isEnabledFor(s: Electron.Session = session.defaultSession) {
        return this.isBlockerAvailable() && this._blocker.isBlockingEnabled(s);
    }

    public get enabled() {
        return this._isEnabled;
    }

    public isBlockerAvailable() {
        return !!this._blocker;
    }
}
