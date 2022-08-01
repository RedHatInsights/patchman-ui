import { remediationIdentifiers } from './constants';
import {
    remediationProviderWithPairs,
    removeUndefinedObjectKeys,
    transformPairs
} from './Helpers';

/**
* Provides remediation data, systems with all of their corresponding issues.
* @param {Function} [setRemediationLoading] function to toggle remediation loading state
* @param {Array} [selectedRows] array of systems to calculate
* @returns {handleSystemsRemoval}
*/
const useRemediationDataProvider = (selectedRows, setRemediationLoading, prepareRemediationPairs) => {
    const remediationDataProvider = () => {
        setRemediationLoading(true);
        return remediationProviderWithPairs(
            removeUndefinedObjectKeys(selectedRows),
            prepareRemediationPairs,
            transformPairs,
            remediationIdentifiers.advisory
        ).then(result => {
            setRemediationLoading(false);
            return result;
        }).catch(err => err);
    };

    return remediationDataProvider;
};

export default useRemediationDataProvider;
