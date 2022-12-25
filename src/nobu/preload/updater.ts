import { ipcRenderer } from "electron";

document.addEventListener("DOMContentLoaded", () => {
    const getVersionTag = () => document.getElementById("version");
    const getState = () => document.getElementById("status");

    ipcRenderer.on("checking-for-update", () => {
        const state = getState();
        if (state) state.innerHTML = "Checking for updates...";
    });

    ipcRenderer.on("current-version", (e, v: string) => {
        const versionTag = getVersionTag();

        if (versionTag && v) {
            versionTag.innerText = v;
            versionTag.classList.remove("hidden");
        }
    });

    ipcRenderer.on("new-update", (e, version) => {
        const state = getState();
        if (state) state.innerHTML = `Update found: <b>${version}</b>!`;
    });

    ipcRenderer.on("download-progress", (e, progress) => {
        let perc = Math.round((progress.current / progress.total) * 100) || 0;
        if (perc < 0) perc = 0;
        else if (perc > 100) perc = 100;

        const state = getState();

        if (state)
            state.innerHTML = `<b>Downloading Update (${perc}%)</b><br><progress max="100" value="${perc}"></progress>`;
    });

    ipcRenderer.on("update-downloaded", () => {
        const state = getState();

        if (state) state.innerHTML = "Finished downloading the update!";
    });

    ipcRenderer.on("error", (e, err) => {
        alert(err);
    });
});
