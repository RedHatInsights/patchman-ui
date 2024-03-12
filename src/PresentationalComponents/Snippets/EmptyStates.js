import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Tooltip, EmptyStateHeader
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { PlusCircleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

export const EmptyAdvisoryList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader titleText={intl.formatMessage(messages.statesNoMatchingAdvisories)} headingLevel="h5" />
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPackagesList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
            titleText={intl.formatMessage(messages.statesNoMatchingPackages)}
            icon={<EmptyStateIcon icon={SearchIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyCvesList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
            titleText={intl.formatMessage(messages.statesNoMatchingCve)}
            icon={<EmptyStateIcon icon={SearchIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptySystemsList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader titleText={intl.formatMessage(messages.statesNoMatchingSystems)} headingLevel="h5" />
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPatchSetList = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
            titleText={intl.formatMessage(messages.statesNoMatchingTemplate)}
            icon={<EmptyStateIcon icon={SearchIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const NoPatchSetList = ({ Button }) => (
    <EmptyState variant={EmptyStateVariant.lg}>
        <EmptyStateHeader
            titleText={intl.formatMessage(messages.statesNoTemplate)}
            icon={<EmptyStateIcon icon={PlusCircleIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>
            {intl.formatMessage(messages.statesNoTemplateBody)}
            <br />
            <br />
            {/*
            <a href={TEMPLATES_DOCS_LINK} target="__blank" rel="noopener noreferrer">
                {intl.formatMessage(messages.statesNoTemplateLink)} <ExternalLinkAltIcon />
            </a>
            <br />
            <br />
            */}
            <Button />
        </EmptyStateBody>
    </EmptyState>
);

NoPatchSetList.propTypes = {
    Button: PropTypes.node
};

export const NoAppliedSystems = ({ onButtonClick, hasAccess }) => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
            titleText={intl.formatMessage(messages.templateNoAppliedSystemsTitle)}
            icon={<EmptyStateIcon icon={PlusCircleIcon} />}
            headingLevel="h5"
        />
        <EmptyStateBody>
            {hasAccess
                ? <Button type="primary" onClick={onButtonClick}>
                    {intl.formatMessage(messages.templateNoAppliedSystemsButton)}
                </Button>
                : <Tooltip content='For editing access, contact your administrator.'>
                    <Button isAriaDisabled>
                        {intl.formatMessage(messages.templateNoAppliedSystemsButton)}
                    </Button>
                </Tooltip>
            }
        </EmptyStateBody>
    </EmptyState>
);

NoAppliedSystems.propTypes = {
    onButtonClick: PropTypes.func,
    hasAccess: PropTypes.bool
};
