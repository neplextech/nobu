import { Menu } from "electron";
import { NobuBrowser } from "../NobuBrowser";
import { getDefaultScreens } from "../screens/createScreens";
import { AdblockerService } from "../services/AdblockerService";
import { commandAccelerators } from "../utils/accelerators";
import { NOBU_GITHUB } from "../utils/constants";
import { isMac } from "../utils/platform";

function getMacAppMenu(nobu: NobuBrowser): Electron.MenuItemConstructorOptions[] {
    return [
        {
            label: nobu.app.name,
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
    ];
}

function getMacEditSubMenu(): Electron.MenuItemConstructorOptions[] {
    return [
        { role: "pasteAndMatchStyle" },
        { role: "delete" },
        { role: "selectAll" },
        { type: "separator" },
        {
            label: "Speech",
            submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
        }
    ];
}

function getEditSubMenu(): Electron.MenuItemConstructorOptions[] {
    return [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }];
}

export function createApplicationMenu(nobu: NobuBrowser) {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: "Edit",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" }
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
                            const screens: NobuSplitView[] = getDefaultScreens(url);

                            nobu.setRenderMode("webview", screens);
                        } else {
                            nobu.setRenderMode("default");
                        }
                    },
                    accelerator: commandAccelerators.MenuDefault.toggleMultiView
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
                    accelerator: commandAccelerators.MenuDefault.toggleAdblocker
                }
            ]
        },
        {
            label: "Themes",
            submenu: [
                {
                    label: "Light",
                    click() {
                        nobu.theme.themeSource = "light";
                    }
                },
                {
                    label: "Dark",
                    click() {
                        nobu.theme.themeSource = "dark";
                    }
                },
                {
                    label: "System",
                    click() {
                        nobu.theme.themeSource = "system";
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
                    accelerator: commandAccelerators.MenuDefault.reloadWindow
                },
                {
                    label: "Zoom In",
                    click() {
                        nobu.handleZoomAction("zoom-in");
                    },
                    accelerator: commandAccelerators.MenuDefault.zoomIn
                },
                {
                    label: "Zoom Out",
                    click() {
                        nobu.handleZoomAction("zoom-out");
                    },
                    accelerator: commandAccelerators.MenuDefault.zoomOut
                },
                {
                    label: "Reset Zoom",
                    click() {
                        nobu.handleZoomAction("zoom-reset");
                    },
                    accelerator: commandAccelerators.MenuDefault.zoomReset
                }
            ]
        },
        {
            label: "About",
            submenu: [
                {
                    label: "GitHub",
                    async click() {
                        await nobu.shell.openExternal(NOBU_GITHUB);
                    }
                }
            ]
        }
    ];

    if (isMac) {
        const editMenu = template.find((i) => i.label === "Edit");
        if (editMenu && Array.isArray(editMenu.submenu)) editMenu.submenu.push(...getMacEditSubMenu());
        template.unshift(...getMacAppMenu(nobu));
    } else {
        const editMenu = template.find((i) => i.label === "Edit");
        if (editMenu && Array.isArray(editMenu.submenu)) editMenu.submenu.push(...getEditSubMenu());
    }

    return Menu.buildFromTemplate(template);
}
