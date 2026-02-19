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
import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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
};

export const store = createStore(
  combineReducers(defaultReducers),
  composeEnhancers(applyMiddleware(promiseMiddleware)),
);
