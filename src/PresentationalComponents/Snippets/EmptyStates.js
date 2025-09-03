import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    Tooltip
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { PlusCircleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

export const EmptyAdvisoryList = () => (
    <EmptyState  headingLevel="h5"   titleText={intl.formatMessage(messages.statesNoMatchingAdvisories)} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPackagesList = () => (
    <EmptyState  headingLevel="h5" icon={SearchIcon}  titleText={intl.formatMessage(messages.statesNoMatchingPackages)} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyCvesList = () => (
    <EmptyState  headingLevel="h5" icon={SearchIcon}  titleText={intl.formatMessage(messages.statesNoMatchingCve)} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptySystemsList = () => (
    <EmptyState  headingLevel="h5"   titleText={intl.formatMessage(messages.statesNoMatchingSystems)} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const EmptyPatchSetList = () => (
    <EmptyState  headingLevel="h5" icon={SearchIcon}  titleText={intl.formatMessage(messages.statesNoMatchingTemplate)} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
            {intl.formatMessage(messages.textEmptyStateBody)}
        </EmptyStateBody>
    </EmptyState>
);

export const NoPatchSetList = ({ Button }) => (
    <EmptyState  headingLevel="h5" icon={PlusCircleIcon}  titleText={intl.formatMessage(messages.statesNoTemplate)} variant={EmptyStateVariant.lg}>
        <EmptyStateBody>
            {intl.formatMessage(messages.statesNoTemplateBody)}
            <br />
            <br />
            <Button />
        </EmptyStateBody>
    </EmptyState>
);

NoPatchSetList.propTypes = {
    Button: PropTypes.node
};

export const NoAppliedSystems = ({ onButtonClick, hasAccess }) => (
    <EmptyState  headingLevel="h5" icon={PlusCircleIcon}  titleText={intl.formatMessage(messages.templateNoAppliedSystemsTitle)} variant={EmptyStateVariant.full}>
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
