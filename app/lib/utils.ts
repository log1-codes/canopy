export function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;

    const debouncedFunction = function (this: any, ...args: Parameters<F>) {
        const context = this;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(context, args);
            timeoutId = null;
        }, delay);
    } as F & { cancel: () => void };

    debouncedFunction.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debouncedFunction;
}