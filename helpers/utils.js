const isBrowser = typeof window !== 'undefined';

export const safeExecute = (exc, defaultValue) => {
    if (isBrowser) {
        return exc()
    }
    return defaultValue;
}
