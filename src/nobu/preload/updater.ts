import { ipcRenderer } from "electron";

const getVersionTag = () => {
    try {
        return require(`${__dirname}/../../package.json`).version;
    } catch {
        return "0.0.0";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const versionTag = document.getElementById("version");
    if (versionTag) {
        versionTag.innerText = getVersionTag();
        versionTag.classList.remove("hidden");
    }

    const state = document.getElementById("status");

    ipcRenderer.on("checking-for-update", (e) => {
        if (state) state.innerHTML = "Checking for updates...";
    });

    ipcRenderer.on("new-update", (e, version) => {
        if (state) state.innerHTML = `Update found: <b>${version}</b>!`;
    });

    ipcRenderer.on("download-progress", (e, progress) => {
        let perc = Math.round((progress.current / progress.total) * 100) || 0;
        if (perc < 0) perc = 0;
        else if (perc > 100) perc = 100;

        if (state)
            state.innerHTML = `<b>Downloading Update (${perc}%)</b><br><progress max="100" value="${perc}"></progress>`;
    });

    ipcRenderer.on("update-downloaded", (e) => {
        if (state) state.innerHTML = "Finished downloading the update!";
    });

    ipcRenderer.on("error", (e, err) => {
        alert(err);
    });
});
