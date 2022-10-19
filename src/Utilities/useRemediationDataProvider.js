import {
    removeUndefinedObjectKeys,
    transformPairs,
    transformSystemsPairs
} from './Helpers';
import {
    fetchViewAdvisoriesSystems,
    fetchViewSystemsAdvisories
} from './api';
import usePaginatedRequest from './usePaginatedRequest';

export const prepareRemediationPairs = async (payload = [], remediationType, areAllSelected) => {
    const shouldMapSystems = remediationType === 'systems' && !areAllSelected;
    const fetchFunction = shouldMapSystems ? fetchViewSystemsAdvisories : fetchViewAdvisoriesSystems;
    const transformerFunction = shouldMapSystems ? transformSystemsPairs : transformPairs;

    const paginatedRequest = usePaginatedRequest(payload, fetchFunction, transformerFunction);

    const fetchedData = await paginatedRequest(
        (payload) => (!areAllSelected || remediationType === 'systems') ? { [remediationType]: payload } : {}
    );

    const response = fetchedData.reduce(
        (prev, current) => {
            return ({ issues: [...prev?.issues || [], ...current?.issues || []] });
        }, {});

    //displays NoDataModal when there is no patch updates available
    return response?.issues?.length ? response : false;
};

/**
* Provides remediation data, systems with all of their corresponding issues.
* @param {Function} [setRemediationLoading] function to toggle remediation loading state
* @param {Array} [selectedRows] array of systems to calculate
* @returns {handleSystemsRemoval}
*/
const useRemediationDataProvider = (selectedRows, setRemediationLoading, remediationType, areAllSelected) => {

    const remediationDataProvider = async () => {
        setRemediationLoading(true);

        const remediationPairs = await prepareRemediationPairs(
            removeUndefinedObjectKeys(selectedRows),
            remediationType,
            areAllSelected
        );

        setRemediationLoading(false);

        return remediationPairs;
    };

    return remediationDataProvider;
};

export default useRemediationDataProvider;
