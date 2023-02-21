import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
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
import { PatchSetDetailStore } from './Reducers/PatchSetDetailStore';
import { SpecificPatchSetReducer } from './Reducers/SpecificPatchSetReducer';
import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';

export const defaultReducers = {
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
    PatchSetDetailStore,
    SpecificPatchSetReducer,
    notifications: notificationsReducer
};

export const store = createStore(combineReducers(defaultReducers), applyMiddleware(promiseMiddleware, notificationsMiddleware()));
