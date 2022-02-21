import { fetchAdvisoryDetailsApi, fetchApplicableAdvisoriesApi,
    fetchApplicablePackagesApi, fetchApplicableSystemAdvisoriesApi, fetchPackageDetailsApi,
    fetchPackagesList, fetchPackageSystems, fetchCvesInfo, fetchSystemDetails, fetchPatchSets } from '../../Utilities/api';
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
    }).then(result => result)
});

export const fetchAvisoryDetails = params => ({
    type: ActionTypes.FETCH_ADVISORY_DETAILS,
    payload: new Promise(resolve => {
        resolve(fetchAdvisoryDetailsApi(params));
    }).then(result => result),
    noError: true
});

export const fetchPackageDetails = params => ({
    type: ActionTypes.FETCH_PACKAGE_DETAILS,
    payload: new Promise(resolve => {
        resolve(fetchPackageDetailsApi(params));
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

export const changeAdvisorySystemsParams = params => ({
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

export const clearAdvisoryDetailStore = () => ({
    type: ActionTypes.CLEAR_ADVISORY_DETAILS,
    payload: []
});

export const clearPackageDetailStore = () => ({
    type: ActionTypes.CLEAR_PACKAGE_DETAILS,
    payload: []
});

export const fetchPackageSystemsAction = params => ({
    type: ActionTypes.FETCH_PACKAGE_SYSTEMS,
    payload: new Promise(resolve => {
        resolve(fetchPackageSystems(params));
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

export const changeGlobalTags = params => ({
    type: ActionTypes.CHANGE_GLOBAL_TAGS,
    payload: params
});

export const changeTags = params => ({
    type: ActionTypes.CHANGE_TAGS,
    payload: params
});

export const changeProfile = params => ({
    type: ActionTypes.CHANGE_PROFILE,
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

export const changePackageSystemsParams = params => ({
    type: ActionTypes.CHANGE_PACKAGE_SYSTEMS_PARAMS,
    payload: params
});

export const fetchCves = (params) => ({
    type: ActionTypes.FETCH_CVES_INFO,
    payload: new Promise(resolve => {
        resolve(fetchCvesInfo(params));
    }).then(result => result)
});

export const changeCvesListParams = params => ({
    type: ActionTypes.CHANGE_CVES_STORE_PARAMS,
    payload: params
});

export const fetchSystemDetailsAction = params => ({
    type: ActionTypes.FETCH_SYSTEM_DETAIL,
    payload: new Promise(resolve => {
        resolve(fetchSystemDetails(params));
    }).then(result => result),
    meta: { noError: true }
});

export const clearEntitiesStore = () => ({
    type: ActionTypes.CLEAR_ENTITIES,
    payload: []
});

export const clearInventoryReducer = () => ({
    type: ActionTypes.CLEAR_INVENTORY_REDUCER,
    payload: []
});

export const changeEntitiesParams = params => ({
    type: ActionTypes.CHANGE_ENTITIES_PARAMS,
    payload: params
});

export const changeSystemsParams = params => ({
    type: ActionTypes.CHANGE_SYSTEMS_PARAMS,
    payload: params
});

export const changeAffectedSystemsParams = params => ({
    type: ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS,
    payload: params
});

export const clearPackageSystemsReducer = () => ({
    type: ActionTypes.CLEAR_PACKAGE_SYSTEMS_REDUCER,
    payload: []
});

export const clearAdvisorySystemsReducer = () => ({
    type: ActionTypes.CLEAR_ADVISORY_SYSTEMS_REDUCER,
    payload: []
});

export const changeSystemsMetadata = (params) => ({
    type: ActionTypes.CHANGE_SYSTEMS_METADATA,
    payload: params
});

export const fetchPatchSetsAction = params => ({
    type: ActionTypes.FETCH_ALL_PATCH_SETS,
    payload: new Promise(resolve => {
        resolve(fetchPatchSets(params));
    }).then(result => result)
});

export const changePatchSetParams = (params) => ({
    type: ActionTypes.CHANGE_PATCH_SET_PARAMS,
    payload: params
});

export const selectPatchSetRow = rowState => ({
    type: ActionTypes.SELECT_PATCH_SET_ROW,
    payload: rowState
});
