import React from 'react';
import { GridItem } from '@patternfly/react-core';

import messages from '../../Messages';
import { fetchIDs, fetchSystems } from '../../Utilities/api';

export const filterSystemsWithoutSets = (systemsIDs) =>  {
    return fetchSystems({
        limit: -1, 'filter[baseline_name]': 'neq:',
        filter: { stale: [true, false] }
    }).then((allSystemsWithPatchSet) => {
        return systemsIDs.filter(systemID =>
            allSystemsWithPatchSet?.data?.some(system => system.id === systemID)
        );
    });
};

export const filterSatelliteManagedSystems = (systemsIDs) =>  {
    return fetchIDs('/ids/systems', {
        limit: -1, 'filter[satellite_managed]': 'false',
        filter: { stale: [true, false] }
    }).then((systemsNotManagedBySatellite) => {
        return systemsIDs.filter(systemID =>
            systemsNotManagedBySatellite?.data?.some(system => system.id === systemID)
        );
    });
};

export const renderUnassignModalMessages = (bodyMessage, systemsCount, intl) => (<GridItem>
    {intl.formatMessage(
        messages[bodyMessage],
        { systemsCount, b: (...chunks) => <b>{chunks}</b> }
    )}
</GridItem>);

