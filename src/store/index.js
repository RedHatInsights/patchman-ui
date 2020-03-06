import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { AdvisoryDetailStore } from './Reducers/AdvisoryDetailStore';
import { AdvisoryListStore } from './Reducers/AdvisoryListStore';
import { AffectedSystemsStore } from './Reducers/AffectedSystemsStore';
import { SystemAdvisoryListStore } from './Reducers/SystemAdvisoryListStore';
import { SystemDetailStore } from './Reducers/SystemDetailStore';
import { SystemsListStore } from './Reducers/SystemsListStore';

let registry;

export function init(...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [promiseMiddleware(), notificationsMiddleware(), ...middleware]);

    registry.register({
        AdvisoryListStore,
        SystemsListStore,
        SystemDetailStore,
        SystemAdvisoryListStore,
        AdvisoryDetailStore,
        AffectedSystemsStore,
        notifications
    });

    return registry;
}

export function getStore() {
    return registry.getStore();
}

export function register(...args) {
    return registry.register(...args);
}
