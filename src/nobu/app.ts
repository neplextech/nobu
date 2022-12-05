import { app, BrowserWindow } from "electron";
import { NobuBrowser } from "./NobuBrowser";

let nobu: NobuBrowser;

function bootstrap() {
    nobu = new NobuBrowser();

    const tab = nobu.tabs.new();
    tab.webContents.loadURL("https://www.google.com");
    nobu.create();
    nobu.tabs.resize(tab);
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
