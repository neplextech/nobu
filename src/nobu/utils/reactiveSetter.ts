type OnSetCallback<K, V> = (key: K, value: V) => unknown;

export function reactiveSetter<T extends object, K extends keyof T>(target: T, keys: K[], onSet: OnSetCallback<K, T[K]>) {
    return new Proxy(target, {
        set(target, p: any, newValue) {
            if (keys.includes(p)) onSet(p, newValue);
            return Reflect.set(target, p, newValue);
        }
    });
}

