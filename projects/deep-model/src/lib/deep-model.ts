import {Signal, signal, WritableSignal} from '@angular/core';
import {IsArrayNullable, IsKnownRecordNullable, IsPrimitiveNullable} from "./type-utils";

export type DeepModel<T> = IsPrimitiveNullable<T> extends true
    ? WritableSignal<T>
    : IsArrayNullable<T> extends true
        ? { [K in keyof T]: DeepModel<T[K]> } & WritableSignal<T>
        : IsKnownRecordNullable<T> extends true
            ? { [K in keyof T]: DeepModel<T[K]> } & WritableSignal<T>
            : Signal<T>;

class DeepModelHandler<T> implements ProxyHandler<DeepModel<T>> {

    private readonly _modelSignal: WritableSignal<T>;

    private readonly _cache: Partial<Record<keyof T | number, DeepModel<any> | WritableSignal<any>>> = {};

    constructor(private model: T) {
        this._modelSignal = signal<T>(this.model);
    }

    apply(target: DeepModel<T>, thisArg: any, argArray: any[]): T {
        let result: any = this.createModelValue(this._modelSignal());
        return result as T;
    }

    get(target: DeepModel<T>, prop: string | symbol, receiver: any) {
        if ((typeof prop) != "string") {
            return null;
        }
        let propStr = prop as string;
        {
            if (propStr.toLowerCase() == "tostring") {
                return JSON.stringify(this._modelSignal());
            }
            if (propStr.toLowerCase() == "set") {
                return (value: T) => {
                    this.clearCache();
                    this._modelSignal.set(value);
                };
            }
            if (propStr.toLowerCase() == "update") {
                return (updateFn: (value: T) => T) => {
                    this.clearCache();
                    this._modelSignal.update(updateFn);
                };
            }
            if (propStr.toLowerCase() == "asReadonly") {
                return this._modelSignal.asReadonly.bind(this._modelSignal);
            }
        }
        const key = propStr as keyof T;
        const model = this._modelSignal();
        if (!Object.hasOwnProperty.apply(model, [key])) {
            throw Error("property not found: " + propStr);
        }
        if (key in this._cache) {
            return this._cache[key];
        }
        const value = model[key];
        if (typeof value == 'object') {
            let deepSignalObj = deepModel(value);
            this._cache[key] = deepSignalObj;
            return deepSignalObj;
        } else {
            let signalObj = signal(value);
            this._cache[key] = signalObj;
            return signalObj;
        }
    }

    private clearCache() {
        for (const prop in this._cache) {
            const key = prop as keyof T;
            delete this._cache[key];
        }
    }

    private createModelValue(currentModel: T): any {
        if (Array.isArray(currentModel)) {
            const array: any[] = currentModel as [];
            for (let i = 0; i < array.length; i++) {
                const signalObj = this._cache[i];
                if (signalObj) {
                    const signalValue = signalObj();
                    const arrayValue = array[i];
                    if (typeof signalValue == 'object') {
                        if (!this.deepEquals(signalValue, arrayValue)) {
                            array[i] = signalValue;
                        }
                    } else {
                        array[i] = signalObj();
                    }
                    console.info(array[i], signalValue);
                }
            }
            return array as T;
        } else {
            const result = {...currentModel};
            for (const prop in this._cache) {
                const key = prop as keyof T;
                const signalObj = this._cache[key];
                if (signalObj) {
                    const signalValue = signalObj() as T[keyof T];
                    const propValue = result[key];
                    if (!this.deepEquals(signalValue, propValue)) {
                        result[key] = signalValue;
                    }
                }
            }
            return result;
        }
    }

    private deepEquals(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true; // 同じオブジェクトや値の場合はtrue
        }

        if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
            return false; // どちらかがオブジェクトでないか、nullの場合はfalse
        }

        // 配列かどうかをチェック
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
                return false; // 配列の長さが異なる場合はfalse
            }

            // 配列の要素を再帰的に比較
            for (let i = 0; i < obj1.length; i++) {
                if (!this.deepEquals(obj1[i], obj2[i])) {
                    return false;
                }
            }
            return true;
        } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
            return false; // 一方が配列で他方がオブジェクトの場合はfalse
        }

        // オブジェクトのプロパティを比較
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false; // プロパティの数が異なる場合はfalse
        }

        for (const key of keys1) {
            if (!keys2.includes(key) || !this.deepEquals(obj1[key], obj2[key])) {
                return false; // キーが存在しない、または値が一致しない場合
            }
        }

        return true;
    }
}

export function deepModel<T>(model: T): DeepModel<T> {
    let target: Function = function () {
    };
    return new Proxy(target, new DeepModelHandler<T>(model)) as DeepModel<T>;
}

