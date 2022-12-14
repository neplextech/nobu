import { app, BrowserWindow, Menu } from "electron";
import { createApplicationMenu } from "./menu/appMenu";
import { NobuBrowser } from "./NobuBrowser";
import { NobuUpdater } from "./updater/NobuUpdater";
import { isDev } from "./utils/isDev";

let nobu: NobuBrowser;

process.on("uncaughtException", (...params) => {
    if (isDev) console.log(...params);
});
process.on("unhandledRejection", (...params) => {
    if (isDev) console.log(...params);
});

async function bootstrap() {
    let updater = new NobuUpdater();
    updater.start();
    const hadUpdate = await updater.check();
    if (hadUpdate) return updater.stop();

    nobu = new NobuBrowser();

    nobu.window.once("ready-to-show", () => {
        updater.stop();
        (updater as NobuUpdater | null) = null;

        const tab = nobu.tabs.new();
        tab.webContents.loadURL("https://www.google.com");
        nobu.create();
        nobu.tabs.resize(tab);
    });

    Menu.setApplicationMenu(createApplicationMenu(nobu));
}

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
