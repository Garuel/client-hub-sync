export namespace TypeGuardsUtil {
    export function IsNotNull<T>(item: T | null): item is T {
        return item !== null;
    }
}