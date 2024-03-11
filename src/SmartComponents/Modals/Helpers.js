import React from 'react';
import { GridItem } from '@patternfly/react-core';

import messages from '../../Messages';
import { fetchIDs } from '../../Utilities/api';

const filterChosenSystems = (urlFilter, systemsIDs, fetchBatched, totalItems) => {
    return fetchBatched(
        (filter) => fetchIDs(
            '/ids/systems',
            filter
        ),
        {
            ...urlFilter,
            filter: { stale: [true, false] }
        },
        totalItems,
        100
    ).then((systemsNotManagedBySatellite) => {
        const aggregatedResult = systemsNotManagedBySatellite.flatMap(({ data }) => data);
        return systemsIDs.filter(systemID =>{
            return aggregatedResult?.some(system => system.id === systemID);
        }
        );
    });
};

export const filterSystemsWithoutSets = (systemsIDs, fetchBatched, totalItems) =>  {
    const urlFilter = { 'filter[baseline_name]': 'neq:' };
    return filterChosenSystems(urlFilter, systemsIDs, fetchBatched, totalItems);
};

export const filterSatelliteManagedSystems = (systemsIDs, fetchBatched, totalItems) =>  {
    const urlFilter = { 'filter[satellite_managed]': 'false' };
    return filterChosenSystems(urlFilter, systemsIDs, fetchBatched, totalItems);
};

export const renderUnassignModalMessages = (bodyMessage, systemsCount, intl) => (<GridItem>
    {intl.formatMessage(
        messages[bodyMessage],
        { systemsCount, b: (...chunks) => <b>{chunks}</b> }
    )}
</GridItem>);

