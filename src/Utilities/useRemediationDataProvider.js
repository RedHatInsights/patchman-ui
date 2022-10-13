import { remediationIdentifiers } from './constants';
import {
    remediationProviderWithPairs,
    removeUndefinedObjectKeys,
    transformPairs,
    transformSystemsPairs
} from './Helpers';
import {
    fetchViewAdvisoriesSystems,
    fetchViewSystemsAdvisories
} from './api';

export const prepareRemediationPairs = (payload = {}, remediationType) => {
    return remediationType === 'systems' ? fetchViewSystemsAdvisories(payload)
        : fetchViewAdvisoriesSystems(payload);
};

/**
* Provides remediation data, systems with all of their corresponding issues.
* @param {Function} [setRemediationLoading] function to toggle remediation loading state
* @param {Array} [selectedRows] array of systems to calculate
* @returns {handleSystemsRemoval}
*/
const useRemediationDataProvider = (selectedRows, setRemediationLoading, remediationType) => {
    const remediationDataProvider = async () => {
        setRemediationLoading(true);

        const remediationPairs = await prepareRemediationPairs(
            { [remediationType]: removeUndefinedObjectKeys(selectedRows) },
            remediationType
        );

        setRemediationLoading(false);

        return remediationProviderWithPairs(
            remediationPairs,
            remediationType === 'systems' ? transformSystemsPairs : transformPairs,
            remediationIdentifiers.advisory
        );
    };

    return remediationDataProvider;
};

export default useRemediationDataProvider;
