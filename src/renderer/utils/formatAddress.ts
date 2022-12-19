export function formatAddress(src: string) {
    try {
        const url = new URL(src);
        return url.href;
    } catch {
        return `https://www.google.com/search?q=${encodeURIComponent(src)}`;
    }
}
