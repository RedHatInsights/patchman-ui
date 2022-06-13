import { remediationIdentifiers } from '../../Utilities/constants';
import {
    remediationProviderWithPairs,
    removeUndefinedObjectKeys,
    transformPairs
} from '../../Utilities/Helpers';
import { prepareRemediationPairs } from './SystemsHelpers';
/**
* Provides remediation data, systems with all of their corresponding issues.
* @param {Function} [setRemediationLoading] function to toggle remediation loading state
* @param {Array} [selectedRows] array of systems to calculate
* @returns {handleSystemsRemoval}
*/
const useRemediationDataProvider = (selectedRows, setRemediationLoading) => {
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
