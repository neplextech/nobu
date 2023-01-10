import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import { USER_AGENT } from "../utils/constants";

export class NobuUpdater {
    public updater = autoUpdater;
    public window: BrowserWindow | null = null;
    public constructor() {
        this.updater.allowDowngrade = false;
        this.updater.autoDownload = false;
        this.updater.autoInstallOnAppQuit = true;
        // this.updater.forceDevUpdateConfig = true;
    }

    public start() {
        this.window = new BrowserWindow({
            width: 300,
            height: 300,
            resizable: false,
            frame: false,
            webPreferences: {
                devTools: false,
                nodeIntegration: false,
                preload: `${__dirname}/../preload/updater.js`,
                contextIsolation: true
            }
        });

        this.window.webContents.setUserAgent(USER_AGENT);

        this.window.loadFile(`${__dirname}/updater.html`);

        this.window.once("ready-to-show", () => {
            this.window?.webContents.send("current-version", this.__getCurrentVersion());
        });
    }

    private __getCurrentVersion() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(`${__dirname}/../../package.json`).version as string;
        } catch {
            return null;
        }
    }

    public check() {
        if (!app.isPackaged) return Promise.resolve(false);
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            this.updater.on("update-not-available", () => {
                resolve(false);
            });

            this.updater.on("update-available", (info) => {
                this.window?.webContents.send("new-update", info.version);
                this.updater.downloadUpdate().catch(() => resolve(false));
            });

            this.updater.on("checking-for-update", () => {
                this.window?.setProgressBar(2);
                this.window?.webContents.send("checking-for-update");
            });

            this.updater.on("update-downloaded", () => {
                this.window?.setProgressBar(-1);
                this.window?.webContents.send("update-downloaded");
                this.updater.quitAndInstall();
                resolve(true);
            });

            this.updater.on("download-progress", (progress) => {
                const total = progress.total;
                const current = progress.transferred;

                this.window?.webContents.send("download-progress", { total, current });

                let prg = current / total;
                if (prg < 0) prg = 0;
                if (prg > 1) prg = -1;
                this.window?.setProgressBar(prg);
            });

            this.updater.on("error", (err) => {
                this.window?.webContents.send("error", `Error updating app:\n\n${err}`);
                resolve(false);
            });

            const updateInfo = await this.updater.checkForUpdates().catch(() => null);
            if (!updateInfo) return resolve(false);
        });
    }

    public stop() {
        try {
            if (this.window) {
                this.window.setProgressBar(-1);
                this.window.destroy();
            }
            this.window = null;
        } catch {
            this.window = null;
        }
    }
}
