import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import { resizeView } from "./window/utils";
import { createBrowserView } from "./window/view";

let window: BrowserWindow, currentView: BrowserView;

function bootstrap() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            devTools: !app.isPackaged,
            preload: `${__dirname}/preload/main.js`
        },
        show: false
    });

    if (!app.isPackaged) {
        window.loadURL("http://localhost:3000");
    } else {
        window.loadFile(`${__dirname}/../dist/index.html`);
    }

    currentView = createBrowserView();

    currentView.webContents.on("will-navigate", (ev, url) => {
        console.log("will-navigate", url);
        window.webContents.send("set-page-url", url);
    });

    currentView.webContents.on("did-navigate-in-page", (ev, url) => {
        console.log("did-navigate-in-page", url);
        window.webContents.send("set-page-url", url);
    });

    window.setBrowserView(currentView);
    resizeView(currentView, window);
    currentView.setBackgroundColor("#FFFFFF");
    window.show();

    if (window.maximizable) window.maximize();
    currentView.webContents.loadURL("https://www.google.com");
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

ipcMain.on("navigate", (e, url: string) => {
    if (!currentView) return;
    currentView.webContents.loadURL(url);
});

ipcMain.on("back", () => {
    if (!currentView) return;
    if (currentView.webContents.canGoBack()) currentView.webContents.goBack();
});

ipcMain.on("reload", () => {
    if (!currentView) return;
    currentView.webContents.reload();
});

ipcMain.on("forward", () => {
    if (!currentView) return;
    if (currentView.webContents.canGoForward()) currentView.webContents.goForward();
});
