export type IsPrimitive<T> = T extends string | number | boolean | symbol | bigint | Date | Blob | BigInt64Array | BigUint64Array | ArrayBuffer ? true : false;
export type IsPrimitiveNullable<T> = IsPrimitive<Exclude<T, null | undefined>>;
export type IsArray<T> = T extends unknown[] ? true : false;
export type IsArrayNullable<T> = IsArray<Exclude<T, null | undefined>>;

export type IsRecord<T> = T extends object
    ? T extends unknown[]
        ? false
        : T extends Set<unknown>
            ? false
            : T extends Map<unknown, unknown>
                ? false
                : T extends Function
                    ? false
                    : true
    : false;

export type IsUnknownRecord<T> = string extends keyof T
    ? true
    : number extends keyof T
        ? true
        : false;

export type IsKnownRecord<T> = IsRecord<T> extends true
    ? IsUnknownRecord<T> extends true
        ? false
        : true
    : false;

export type IsKnownRecordNullable<T> = IsKnownRecord<Exclude<T, null | undefined>>;
