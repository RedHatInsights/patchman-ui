import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import promiseMiddleware from 'redux-promise-middleware';
import { AdvisoryDetailStore } from './Reducers/AdvisoryDetailStore';
import { AdvisoryListStore } from './Reducers/AdvisoryListStore';
import { CvesListStore } from './Reducers/CvesListStore';
import { PackageDetailStore } from './Reducers/PackageDetailStore';
import { PackagesListStore } from './Reducers/PackagesListStore';
import { SystemAdvisoryListStore } from './Reducers/SystemAdvisoryListStore';
import { SystemDetailStore } from './Reducers/SystemDetailStore';
import { SystemPackageListStore } from './Reducers/SystemPackageListStore';
import { SystemsStore } from './Reducers/SystemsStore';
import { PackageSystemsStore } from './Reducers/PackageSystemsStore';
import { AdvisorySystemsStore } from './Reducers/AdvisorySystemsStore';
import { GlobalFilterStore } from './Reducers/GlobalFilterStore';
import { PatchSetsReducer } from './Reducers/PatchSetsReducer';
import { SpecificPatchSetReducer } from './Reducers/SpecificPatchSetReducer';
// import MiddlewareListener from '@redhat-cloud-services/frontend-components-utilities/MiddlewareListener';
// import { ReducerRegistry } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
// import promise  from 'redux-promise-middleware';
import { createContext } from 'react';

export const init = (...middleware) => {
    const registry = getRegistry({}, [promiseMiddleware, notificationsMiddleware()]);

    registry.register({
        AdvisoryListStore,
        SystemDetailStore,
        SystemAdvisoryListStore,
        AdvisoryDetailStore,
        SystemPackageListStore,
        PackagesListStore,
        PackageDetailStore,
        CvesListStore,
        SystemsStore,
        PackageSystemsStore,
        AdvisorySystemsStore,
        GlobalFilterStore,
        PatchSetsStore: PatchSetsReducer,
        SpecificPatchSetReducer,
        notifications: notificationsReducer
    });
    return registry;
};

export const getStore = () => registry.getStore();

export const RegistryContext = createContext({
    getRegistry: () => {}
});

export const register = newReducers => {
    registry.register(newReducers);
};
