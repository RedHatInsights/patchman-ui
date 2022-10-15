import chunk from 'lodash/chunk';
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

const PAIRS_CHUNK_SIZE = 100;

export const prepareRemediationPairs = (payload = [], remediationType) => {
    const fetchFunction = remediationType === 'systems' ? fetchViewSystemsAdvisories : fetchViewAdvisoriesSystems;
    const payloadChunks = chunk(payload, PAIRS_CHUNK_SIZE);

    const fetchPromises = [];
    for (let i = 0; i < payloadChunks.length; i++) {
        fetchPromises.push(fetchFunction({ [remediationType]: payloadChunks[i] }));
    }

    return Promise.all(fetchPromises).then(result =>
        result.reduce(
            (prev, current) => ({ data: { ...prev.data, ...current.data } }),
            { data: {} }
        )
    );
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
            removeUndefinedObjectKeys(selectedRows),
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
