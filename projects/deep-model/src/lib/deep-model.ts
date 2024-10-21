import {DeepModel} from './types';
import {DeepModelHandler} from './DeepModelHandler';

export function deepModel<T>(model: T): DeepModel<T> {
    let target: Function = function () {
    };
    return new Proxy(target, new DeepModelHandler<T>(model)) as DeepModel<T>;
}

