import { fetchAdvisoryDetailsApi, fetchAffectedSystems, fetchApplicableAdvisoriesApi,
    fetchApplicablePackagesApi, fetchApplicableSystemAdvisoriesApi,
    fetchPackageDetailsApi, fetchPackagesList, fetchSystems } from '../../Utilities/api';
import * as ActionTypes from '../ActionTypes';

export const fetchApplicableAdvisories = params => ({
    type: ActionTypes.FETCH_APPLICABLE_ADVISORIES,
    payload: new Promise(resolve => {
        resolve(fetchApplicableAdvisoriesApi(params));
    }).then(result => result)
});

export const fetchApplicableSystemAdvisories = params => ({
    type: ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES,
    payload: new Promise(resolve => {
        resolve(fetchApplicableSystemAdvisoriesApi(params));
    }).then(result => result),
    meta: {
        noError: true // Handle errors manually!
    }
});

export const fetchAvisoryDetails = params => ({
    type: ActionTypes.FETCH_ADVISORY_DETAILS,
    payload: new Promise(resolve => {
        resolve(fetchAdvisoryDetailsApi(params));
    }).then(result => result)
});

export const fetchPackageDetails = params => ({
    type: ActionTypes.FETCH_PACKAGE_DETAILS,
    payload: new Promise(resolve => {
        resolve(fetchPackageDetailsApi(params));
    }).then(result => result)
});

export const fetchSystemsAction = params => ({
    type: ActionTypes.FETCH_SYSTEMS,
    payload: new Promise(resolve => {
        resolve(fetchSystems(params));
    }).then(result => result)
});

export const changeAdvisoryListParams = params => ({
    type: ActionTypes.CHANGE_ADVISORY_LIST_PARAMS,
    payload: params
});

export const changeSystemAdvisoryListParams = params => ({
    type: ActionTypes.CHANGE_SYSTEM_ADVISORY_LIST_PARAMS,
    payload: params
});

export const changeSystemsListParams = params => ({
    type: ActionTypes.CHANGE_SYSTEMS_LIST_PARAMS,
    payload: params
});

export const changeAffectedSystemsParams = params => ({
    type: ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS,
    payload: params
});

export const expandAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_ADVISORY_ROW,
    payload: rowState
});

export const expandSystemAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_SYSTEM_ADVISORY_ROW,
    payload: rowState
});

export const selectAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_ADVISORY_ROW,
    payload: rowState
});

export const selectSystemAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_SYSTEM_ADVISORY_ROW,
    payload: rowState
});

export const clearSystemAdvisoriesStore = () => ({
    type: ActionTypes.CLEAR_SYSTEM_ADVISORIES,
    payload: []
});

export const clearSystemPackagesStore = () => ({
    type: ActionTypes.CLEAR_SYSTEM_PACKAGES,
    payload: []
});

export const clearAffectedSystemsStore = () => ({
    type: ActionTypes.CLEAR_AFFECTED_SYSTEMS,
    payload: []
});

export const clearAdvisoryDetailStore = () => ({
    type: ActionTypes.CLEAR_ADVISORY_DETAILS,
    payload: []
});

export const clearPackageDetailStore = () => ({
    type: ActionTypes.CLEAR_ADVISORY_DETAILS,
    payload: []
});

export const fetchAffectedSystemsAction = params => ({
    type: ActionTypes.FETCH_AFFECTED_SYSTEMS,
    payload: new Promise(resolve => {
        resolve(fetchAffectedSystems(params));
    }).then(result => result)
});

export const fetchApplicableSystemPackages = params => ({
    type: ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES,
    payload: new Promise(resolve => {
        resolve(fetchApplicablePackagesApi(params));
    }).then(result => result)
});

export const selectSystemPackagesRow = rowState => ({
    type: ActionTypes.SELECT_SYSTEM_PACKAGES_ROW,
    payload: rowState
});

export const changeSystemPackagesParams = params => ({
    type: ActionTypes.CHANGE_SYSTEM_PACKAGES_LIST_PARAMS,
    payload: params
});

export const globalFilter = params => ({
    type: ActionTypes.TRIGGER_GLOBAL_FILTER,
    payload: params
});

export const fetchPackagesAction = params => ({
    type: ActionTypes.FETCH_PACKAGES_LIST,
    payload: new Promise(resolve => {
        resolve(fetchPackagesList(params));
    }).then(result => result)
});

export const changePackagesListParams = params => ({
    type: ActionTypes.CHANGE_PACKAGES_LIST_PARAMS,
    payload: params
});
