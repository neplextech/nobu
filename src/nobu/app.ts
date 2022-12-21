import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { createApplicationMenu, createEmptyAppMenu } from "./menu/appMenu";
import { NobuBrowser } from "./NobuBrowser";
import { ProtocolList } from "./services/ProtocolServices";
import { NobuUpdater } from "./updater/NobuUpdater";
import { isDev } from "./utils/isDev";
import { isWindows } from "./utils/platform";

let nobu: NobuBrowser;

process.on("uncaughtException", (...params) => {
    if (isDev) console.log(...params);
});

process.on("unhandledRejection", (...params) => {
    if (isDev) console.log(...params);
});

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(ProtocolList.default.name, process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient(ProtocolList.default.name);
}

const instanceLock = app.requestSingleInstanceLock();

async function bootstrap() {
    let updater: NobuUpdater;

    if (!isDev) {
        updater = new NobuUpdater();
        updater.start();
        const hadUpdate = await updater.check();
        if (hadUpdate) return updater.stop();
    }

    nobu = new NobuBrowser();

    nobu.window.once("ready-to-show", () => {
        if (updater) {
            updater.stop();
            (updater as NobuUpdater | null) = null;
        }

        const tab = nobu.tabs.new({
            offscreen: true
        });
        tab.webContents!.loadURL("https://www.google.com");
        nobu.create();
        tab.resize();
    });

    Menu.setApplicationMenu(isWindows ? createEmptyAppMenu() : createApplicationMenu(nobu));
}

if (!instanceLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (nobu) {
            if (nobu.window.isMinimized()) nobu.window.restore();
            nobu.window.focus();
        }
    });

    app.whenReady().then(() => {
        bootstrap();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                bootstrap();
            }
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
}
