export const SafeJSON = {
    parse<T = unknown>(src: string): T | null {
        try {
            return JSON.parse(src) as T;
        } catch {
            return null;
        }
    },
    stringify(data: unknown): string {
        try {
            return JSON.stringify(data);
        } catch {
            return "{}";
        }
    }
};
