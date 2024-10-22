import {DeepModel} from './types';
import {signal, WritableSignal} from '@angular/core';
import {deepModel} from './deep-model';

export class DeepModelHandler<T> implements ProxyHandler<DeepModel<T>> {

    private readonly _modelSignal: WritableSignal<T>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _cache: Partial<Record<keyof T | number, DeepModel<any> | WritableSignal<any>>> = {};

    constructor(private model: T) {
        this._modelSignal = signal<T>(model);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apply(_target: DeepModel<T>, _thisArg: any, _argArray: any[]): T {
        return this.createModelValue(this._modelSignal()) as T;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(_target: DeepModel<T>, prop: string | symbol, _receiver: any) {
        if ((typeof prop) !== 'string') {
            return null;
        }
        let propStr = prop as string;
        {
            if (propStr.toLowerCase() === 'tostring') {
                return JSON.stringify(this._modelSignal());
            }
            if (propStr.toLowerCase() === 'set') {
                return (value: T) => {
                    this.clearCache();
                    this._modelSignal.set(value);
                };
            }
            if (propStr.toLowerCase() === 'update') {
                return (updateFn: (_value: T) => T) => {
                    this.clearCache();
                    this._modelSignal.update(updateFn);
                };
            }
            if (propStr.toLowerCase() === 'asReadonly') {
                return this._modelSignal.asReadonly.bind(this._modelSignal);
            }
        }
        const key = propStr as keyof T;
        const model = this._modelSignal();
        if (!Object.hasOwnProperty.apply(model, [key])) {
            throw Error('property not found: ' + propStr);
        }
        if (key in this._cache) {
            return this._cache[key];
        }
        const value = model[key];
        if (typeof value === 'object') {
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


    private createModelValue(currentModel: T): T {
        if (Array.isArray(currentModel)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const array: any[] = currentModel as [];
            for (let i = 0; i < array.length; i++) {
                const signalObj = this._cache[i];
                if (signalObj) {
                    const signalValue = signalObj();
                    const arrayValue = array[i];
                    if (typeof signalValue === 'object') {
                        if (!this.deepEquals(signalValue, arrayValue)) {
                            array[i] = signalValue;
                        }
                    } else {
                        array[i] = signalObj();
                    }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private deepEquals(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true;
        }

        if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
            return false;
        }

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
                return false;
            }

            for (let i = 0; i < obj1.length; i++) {
                if (!this.deepEquals(obj1[i], obj2[i])) {
                    return false;
                }
            }
            return true;
        } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (!keys2.includes(key) || !this.deepEquals(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }
}
