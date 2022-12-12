import { NobuBrowser } from "../NobuBrowser";
import { INobuService } from "../services/AbstractService";

export class NobuServiceManager {
    public services = new Map<string, INobuService>();

    public constructor(public nobu: NobuBrowser) {}

    public async register(name: string, service: INobuService, enable = false) {
        if (this.isRegistered(name)) await this.unregister(name);
        this.services.set(name, service);
        if (enable) {
            await service.enable();
        }
    }

    public async unregister(name: string) {
        const service = this.services.get(name);
        if (!service) return;
        await service.disable();
        this.services.delete(name);
    }

    public isRegistered(name: string) {
        return this.services.has(name);
    }

    public getService<T = INobuService>(name: string): T {
        return this.services.get(name) as T;
    }

    public getRegisteredServices() {
        return [...this.services.values()];
    }
}
