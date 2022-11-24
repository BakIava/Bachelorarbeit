export function replaceAt(source: string, index: number, replacement: string) {
    return source.substring(0, index) + replacement + source.substring(index + replacement.length);
}