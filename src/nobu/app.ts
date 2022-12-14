import { app, BrowserWindow, Menu, shell, nativeTheme } from "electron";
import { NobuBrowser } from "./NobuBrowser";
import { createScreens, getDefaultScreens } from "./screens/createScreens";
import { AdblockerService } from "./services/AdblockerService";
import { NobuUpdater } from "./updater/NobuUpdater";

const NOBU_GITHUB = "https://github.com/neplextech/nobu" as const;
const isMac = process.platform === "darwin";

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
            ...(isMac
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
                label: "Edit",
                submenu: [
                    { role: "undo" },
                    { role: "redo" },
                    { type: "separator" },
                    { role: "cut" },
                    { role: "copy" },
                    { role: "paste" },
                    ...(isMac
                        ? ([
                              { role: "pasteAndMatchStyle" },
                              { role: "delete" },
                              { role: "selectAll" },
                              { type: "separator" },
                              {
                                  label: "Speech",
                                  submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
                              }
                          ] as Electron.MenuItemConstructorOptions[])
                        : ([
                              { role: "delete" },
                              { type: "separator" },
                              { role: "selectAll" }
                          ] as Electron.MenuItemConstructorOptions[]))
                ]
            },
            {
                label: "Developer",
                submenu: [
                    {
                        label: "Toggle Multi-View Mode",
                        click() {
                            if (nobu.renderMode === "default") {
                                if (!nobu.tabs.current) return;
                                const url = nobu.tabs.getCurrentURL()!;
                                const screens: WebViewModeConfig[] = getDefaultScreens(url);

                                nobu.setRenderMode("webview", screens);
                            } else {
                                nobu.setRenderMode("default");
                            }
                        },
                        accelerator: "CommandOrControl+Shift+`"
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
                        },
                        accelerator: "CommandOrControl+`"
                    }
                ]
            },
            {
                label: "Themes",
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
                label: "Window",
                submenu: [
                    {
                        label: "Reload Window",
                        click() {
                            nobu.reloadWindow();
                        },
                        accelerator: "CommandOrControl+R"
                    },
                    {
                        label: "Zoom In",
                        click() {
                            nobu.handleZoomAction("zoom-in");
                        },
                        accelerator: "CommandOrControl+numadd"
                    },
                    {
                        label: "Zoom Out",
                        click() {
                            nobu.handleZoomAction("zoom-out");
                        },
                        accelerator: "CommandOrControl+numsub"
                    },
                    {
                        label: "Reset Zoom",
                        click() {
                            nobu.handleZoomAction("zoom-reset");
                        },
                        accelerator: "CommandOrControl+num0"
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
