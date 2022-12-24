import { NobuBrowser } from "../NobuBrowser";
import { INobuService } from "../services/AbstractService";
import type { StorageService, AdblockerService, ProtocolService } from "../services";

interface INobuServiceMap {
    store: StorageService;
    adblocker: AdblockerService;
    protocol: ProtocolService;
}

type ServiceName = keyof INobuServiceMap;
type ServiceValue = INobuServiceMap[ServiceName];

export class NobuServiceManager {
    public services = new Map<ServiceName, ServiceValue>();

    public constructor(public nobu: NobuBrowser) {}

    public async register<K extends ServiceName>(name: K, service: INobuServiceMap[K], enable = false) {
        if (this.isRegistered(name)) await this.unregister(name);
        this.services.set(name, service);
        if (enable) {
            await service.enable();
        }
    }

    public async unregister(name: ServiceName) {
        const service = this.services.get(name);
        if (!service) return;
        await service.disable();
        this.services.delete(name);
    }

    public isRegistered(name: ServiceName) {
        return this.services.has(name);
    }

    public getService<K extends ServiceName>(name: K): INobuServiceMap[K] {
        return this.services.get(name) as INobuServiceMap[K];
    }

    public getRegisteredServices() {
        return [...this.services.values()];
    }
}
