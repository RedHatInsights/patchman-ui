/* eslint new-cap: 0 */
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import promiseMiddleware from 'redux-promise-middleware';
import { AdvisoryDetailStore } from './Reducers/AdvisoryDetailStore';
import { AdvisoryListStore } from './Reducers/AdvisoryListStore';
import { AdvisorySystemsStore } from './Reducers/AdvisorySystemsStore';
import { CvesListStore } from './Reducers/CvesListStore';
import { PackageDetailStore } from './Reducers/PackageDetailStore';
import { PackagesListStore } from './Reducers/PackagesListStore';
import { PackageSystemsStore } from './Reducers/PackageSystemsStore';
import { SystemAdvisoryListStore } from './Reducers/SystemAdvisoryListStore';
import { SystemDetailStore } from './Reducers/SystemDetailStore';
import { SystemPackageListStore } from './Reducers/SystemPackageListStore';
import { SystemsListStore } from './Reducers/SystemsListStore';

const persistenceMiddleware = store => next => action => {
    if (action.type === 'LOAD_ENTITIES_FULFILLED') {
        action = { ...action, store };
    }

    next(action);
    if (!action.type.endsWith('_REJECTED')) {
        const storeContent = store.getState();
        sessionStorage.setItem('PatchStore', JSON.stringify(storeContent));
    }
};

const storage = JSON.parse(sessionStorage.getItem('PatchStore')) || {};

const registry = getRegistry({}, [promiseMiddleware, notificationsMiddleware(), persistenceMiddleware]);
registry.register({
    AdvisoryListStore: (state = storage.AdvisoryListStore, action) => AdvisoryListStore(state, action),
    SystemsListStore: (state = storage.SystemsListStore, action) => SystemsListStore(state, action),
    SystemDetailStore: (state = storage.SystemDetailStore, action) => SystemDetailStore(state, action),
    SystemAdvisoryListStore: (state = storage.SystemAdvisoryListStore, action) => SystemAdvisoryListStore(state, action),
    AdvisoryDetailStore: (state = storage.AdvisoryDetailStore, action) => AdvisoryDetailStore(state, action),
    AdvisorySystemsStore: (state = storage.AdvisorySystemsStore, action) => AdvisorySystemsStore(state, action),
    SystemPackageListStore: (state = storage.SystemPackageListStore, action) => SystemPackageListStore(state, action),
    PackagesListStore: (state = storage.PackagesListStore, action) => PackagesListStore(state, action),
    PackageDetailStore: (state = storage.PackageDetailStore, action) => PackageDetailStore(state, action),
    PackageSystemsStore: (state = storage.PackageSystemsStore, action) => PackageSystemsStore(state, action),
    CvesListStore: (state = storage.CvesListStore, action) => CvesListStore(state, action),
    notifications: notificationsReducer
});

export const getStore = () => registry.getStore();
export const register = newReducers => {
    registry.register(newReducers);
};
