import { protocol } from "electron";
import { safeURL } from "../utils/safeURL";
import { INobuService } from "./AbstractService";
import { fileURLToPath } from "url";

type NobuDefaultHostNames = "multiview";

export const ProtocolList = {
    default: {
        name: "nobu",
        type: "file"
    },
    settings: {
        name: "nobu-settings",
        type: "file"
    },
    file: {
        name: "nobu-file",
        type: "file"
    }
} as const;

function nif(p: string) {
    if (p.startsWith("file://")) return fileURLToPath(p);
    return p;
}

export class ProtocolServices extends INobuService {
    private __register() {
        for (const p of Object.values(ProtocolList)) {
            if (protocol.isProtocolRegistered(p.name)) continue;

            if (p.type === "file")
                protocol.registerFileProtocol(p.name, (req, cb) => {
                    const returnDefault = () => {
                        const u = `file://${req.url.slice((p.name + "://").length)}`;
                        cb(fileURLToPath(u));
                    };

                    if (p.name === "nobu-file" || p.name === "nobu") return returnDefault();

                    const url = safeURL(req.url);
                    if (!url || !url.hostname) return returnDefault();

                    const host = url.hostname as NobuDefaultHostNames;

                    // TODO
                    switch (host) {
                        default:
                            return returnDefault();
                    }
                });
        }
    }

    private __unregister() {
        for (const p of Object.values(ProtocolList)) {
            if (!protocol.isProtocolRegistered(p.name)) continue;

            protocol.unregisterProtocol(p.name);
        }
    }

    public async enable(): Promise<void> {
        this.__register();
    }

    public async disable(): Promise<void> {
        this.__unregister();
    }
}
