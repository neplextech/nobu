export function formatAddress(src: string) {
    try {
        const url = new URL(src);
        return url.href;
    } catch {
        return {
            search: encodeURIComponent(src)
        };
    }
}
