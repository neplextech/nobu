export function safeURL(src: string): URL | null {
    try {
        return new URL(src);
    } catch {
        return null;
    }
}
