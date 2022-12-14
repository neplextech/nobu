const MenuDefault = {
    toggleMultiView: "CommandOrControl+Shift+`",
    toggleAdblocker: "CommandOrControl+`",
    reloadWindow: "CommandOrControl+R",
    zoomIn: "CommandOrControl+numadd",
    zoomOut: "CommandOrControl+numsub",
    zoomReset: "CommandOrControl+num0"
} as const;

const BrowserViewContext = {
    inspect: "CommandOrControl+Shift+I"
} as const;

export const commandAccelerators = {
    MenuDefault,
    BrowserViewContext
};
