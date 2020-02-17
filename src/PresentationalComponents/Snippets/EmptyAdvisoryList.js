/* eslint-disable no-console */
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import React from 'react';

export const EmptyAdvisoryList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h5" size="lg">
            No matching Advisories found
        </Title>
    </EmptyState>
);

export default EmptyAdvisoryList;
