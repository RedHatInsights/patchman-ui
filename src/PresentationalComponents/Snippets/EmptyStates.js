import {
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { LockIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const EmptyAdvisoryList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoMatchingAdvisories)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPackagesList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoMatchingPackages)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyCvesList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoMatchingCve)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptySystemsList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoMatchingSystems)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPatchSetList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoMatchingTemplate)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const NoPatchSetList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoTemplate)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.statesNoTemplateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const NoSmartManagement = () => (
    <EmptyState variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={LockIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoSmartManagementHeader)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(
                messages.statesNoSmartManagementBody,
                { br: <br></br> }
            )}
        </EmptyStateBody>
    </EmptyState>
);
