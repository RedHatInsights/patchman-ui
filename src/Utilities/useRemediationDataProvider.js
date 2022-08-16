import { remediationIdentifiers } from './constants';
import {
    remediationProviderWithPairs,
    removeUndefinedObjectKeys,
    transformPairs
} from './Helpers';
import {
    fetchViewAdvisoriesSystems
} from './api';

export const prepareRemediationPairs = ({ advisories, systems } = {}) => {
    return fetchViewAdvisoriesSystems({ advisories, systems });
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

        const remediationPairs = await prepareRemediationPairs({
            [remediationType]: removeUndefinedObjectKeys(selectedRows)
        });

        setRemediationLoading(false);

        return remediationProviderWithPairs(
            remediationPairs,
            transformPairs,
            remediationIdentifiers.advisory
        );
    };

    return remediationDataProvider;
};

export default useRemediationDataProvider;
