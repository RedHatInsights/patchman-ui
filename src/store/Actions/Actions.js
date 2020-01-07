import {
    fetchApplicableAdvisoriesApi,
    fetchSystems
} from '../../Utilities/api';
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
        resolve(fetchApplicableAdvisoriesApi(params));
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

export const expandAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const expandSystemAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_SYSTEM_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const selectAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const selectSystemAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_SYSTEM_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const clearSystemAdvisoriesStore = () => ({
    type: ActionTypes.CLEAR_SYSTEM_ADVISORIES,
    payload: []
});
