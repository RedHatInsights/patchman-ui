import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { AdvisoryDetailStore } from './Reducers/AdvisoryDetailStore';
import { AdvisoryListStore } from './Reducers/AdvisoryListStore';
import { SystemAdvisoryListStore } from './Reducers/SystemAdvisoryListStore';
import { SystemDetailStore } from './Reducers/SystemDetailStore';
import { SystemsListStore } from './Reducers/SystemsListStore';

let registry;

export function init(...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [promiseMiddleware(), ...middleware]);

    registry.register({
        AdvisoryListStore,
        SystemsListStore,
        SystemDetailStore,
        SystemAdvisoryListStore,
        AdvisoryDetailStore
    });

    return registry;
}

export function getStore() {
    return registry.getStore();
}

export function register(...args) {
    return registry.register(...args);
}
