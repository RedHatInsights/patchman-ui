import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import LockIcon from '@patternfly/react-icons/dist/js/icons/lock-icon';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { ExternalLinkAltIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { TEMPLATES_DOCS_LINK } from '../../Utilities/constants';
import PropTypes from 'prop-types';

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

export const NoPatchSetList = ({ Button }) => (
    <EmptyState variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.statesNoTemplate)}
        </Title>
        <EmptyStateBody>
            {intl.formatMessage(messages.statesNoTemplateBody)}
            <br />
            <br />
            <a href={TEMPLATES_DOCS_LINK} target="__blank" rel="noopener noreferrer">
                {intl.formatMessage(messages.statesNoTemplateLink)} <ExternalLinkAltIcon />
            </a>
            <br />
            <br />
            <Button />
        </EmptyStateBody>
    </EmptyState>
);

NoPatchSetList.propTypes = {
    Button: PropTypes.node
};

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

export const NoAppliedSystems = ({ onButtonClick }) => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
            {intl.formatMessage(messages.templateNoAppliedSystemsTitle)}
        </Title>
        <EmptyStateBody>
            <Button type="primary" onClick={onButtonClick}>
                {intl.formatMessage(messages.templateNoAppliedSystemsButton)}
            </Button>
        </EmptyStateBody>
    </EmptyState>
);

NoAppliedSystems.propTypes = {
    onButtonClick: PropTypes.func
};
