import { Card, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import FrownOpenIcon from '@patternfly/react-icons/dist/js/icons/frown-open-icon';
import propTypes from 'prop-types';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const Error = ({ message }) =>
    <Card>
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={FrownOpenIcon} color="black"/>
            <Title headingLevel="h5" size="lg">
                {intl.formatMessage(messages.statesError)}
            </Title>
            <EmptyStateBody>
                {message}
            </EmptyStateBody>
        </EmptyState></Card>;

export default Error;

Error.propTypes = {
    message: propTypes.string
};
