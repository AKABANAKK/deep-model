import {IsArrayNullable, IsKnownRecordNullable, IsPrimitiveNullable} from "./type-utils";
import {Signal, WritableSignal} from '@angular/core';

export type DeepModel<T> = IsPrimitiveNullable<T> extends true
    ? WritableSignal<T>
    : IsArrayNullable<T> extends true
        ? { [K in keyof T]: DeepModel<T[K]> } & WritableSignal<T>
        : IsKnownRecordNullable<T> extends true
            ? { [K in keyof T]: DeepModel<T[K]> } & WritableSignal<T>
            : Signal<T>;
