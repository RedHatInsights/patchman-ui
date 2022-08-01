import {
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';

export const prepareRemediationPairs = (issues) => {
    return fetchSystems({ limit: -1 }).then(
        ({ data }) => fetchViewAdvisoriesSystems(
            {
                advisories: issues,
                systems: data.map(system => system.id)
            }
        ));
};
