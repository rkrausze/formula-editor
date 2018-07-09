namespace fe {
    export class StrUtil {

        static startsWith(haystack: string, needle: string, start: number = 0) {
            return haystack.indexOf(needle, start) == start;
        }

        static endsWith(haystack: string, needle: string, start: number = 0) {
            let lHaystack = haystack.length;
            let lNeedle = needle.length;
            return lNeedle <= lHaystack && haystack.substr(lHaystack-lNeedle) == needle;
        }
    }
}
