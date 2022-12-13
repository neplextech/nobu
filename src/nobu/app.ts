import { app, BrowserWindow, Menu, shell, nativeTheme } from "electron";
import { NobuBrowser } from "./NobuBrowser";
import { createScreens } from "./screens/createScreens";
import { AdblockerService } from "./services/AdblockerService";
import { NobuUpdater } from "./updater/NobuUpdater";

const NOBU_GITHUB = "https://github.com/neplextech/nobu" as const;

let nobu: NobuBrowser;

process.on("uncaughtException", (...params) => {
    if (!app.isPackaged) console.log(...params);
});
process.on("unhandledRejection", (...params) => {
    if (!app.isPackaged) console.log(...params);
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

    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            ...(process.platform === "darwin"
                ? ([
                      {
                          label: app.name,
                          submenu: [
                              { role: "about" },
                              { type: "separator" },
                              { role: "services" },
                              { type: "separator" },
                              { role: "hide" },
                              { role: "hideOthers" },
                              { role: "unhide" },
                              { type: "separator" },
                              { role: "quit" }
                          ]
                      }
                  ] as Electron.MenuItemConstructorOptions[])
                : []),
            {
                label: "Developer",
                submenu: [
                    {
                        label: "Toggle WebView Mode",
                        click() {
                            if (nobu.renderMode === "default") {
                                if (!nobu.tabs.current) return;
                                const url = nobu.tabs.getCurrentURL()!;
                                const screens: WebViewModeConfig[] = createScreens(url);

                                nobu.setRenderMode("webview", screens);
                            } else {
                                nobu.setRenderMode("default");
                            }
                        }
                    },
                    {
                        label: "Toggle Adblocker",
                        async click() {
                            const service = nobu.services.getService<AdblockerService>("adblocker");
                            if (!service) return;
                            if (!service.enabled) {
                                await service.enable();
                                nobu.alert("Adblocker is now enabled!");
                            } else {
                                await service.disable();
                                nobu.alert("Adblocker is now disabled!");
                            }
                        }
                    }
                ]
            },
            {
                label: "Theme",
                submenu: [
                    {
                        label: "Light",
                        click() {
                            nativeTheme.themeSource = "light";
                        }
                    },
                    {
                        label: "Dark",
                        click() {
                            nativeTheme.themeSource = "dark";
                        }
                    },
                    {
                        label: "System",
                        click() {
                            nativeTheme.themeSource = "system";
                        }
                    }
                ]
            },
            {
                label: "About",
                submenu: [
                    {
                        label: "GitHub",
                        async click() {
                            await shell.openExternal(NOBU_GITHUB);
                        }
                    }
                ]
            }
        ])
    );
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
