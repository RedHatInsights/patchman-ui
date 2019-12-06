import { fetchApplicableAdvisoriesApi } from '../../Utilities/api';
import * as ActionTypes from '../ActionTypes';

export const fetchApplicableAdvisories = params => ({
    type: ActionTypes.FETCH_APPLICABLE_ADVISORIES,
    payload: new Promise(resolve => {
        resolve(fetchApplicableAdvisoriesApi(params));
    }).then(result => result)
});

export const changeAdvisoryListParams = params => ({
    type: ActionTypes.CHANGE_ADVISORY_LIST_PARAMS,
    payload: params
});

export const expandAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const selectAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_ADVISORY_ROW,
    payload: [].concat(rowState)
});
