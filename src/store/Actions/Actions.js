import { fetchApplicableSystems } from '../../Utilities/api';
import * as ActionTypes from '../ActionTypes';

export const fetchApplicableAdvisories = () => ({
    type: ActionTypes.FETCH_APPLICABLE_ADVISORIES,
    payload: new Promise(resolve => {
        resolve(fetchApplicableSystems());
    }).then(result => result)
});

export const expandAdvisoryRow = rowState => ({
    type: ActionTypes.EXPAND_ADVISORY_ROW,
    payload: [].concat(rowState)
});

export const selectAdvisoryRow = rowState => ({
    type: ActionTypes.SELECT_ADVISORY_ROW,
    payload: [].concat(rowState)
});
