import React from 'react';
import { GridItem } from '@patternfly/react-core';

import messages from '../../Messages';
import { fetchSystems } from '../../Utilities/api';

export const filterSystemsWithoutSets = (systemsIDs) =>  {
    return fetchSystems({ limit: -1, 'filter[baseline_name]': 'neq:' }).then((allSystemsWithPatchSet) => {
        return systemsIDs.filter(systemID =>
            allSystemsWithPatchSet?.data.some(system => system.id === systemID)
        );
    });
};

export const renderUnassignModalMessages = (bodyMessage, systemsCount, intl) => (<GridItem>
    {intl.formatMessage(
        messages[bodyMessage],
        { systemsCount, b: (...chunks) => <b>{chunks}</b> }
    )}
</GridItem>);

