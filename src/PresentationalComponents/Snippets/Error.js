import { Card, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, EmptyStateHeader  } from '@patternfly/react-core';
import { FrownOpenIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const Error = ({ message }) =>
    <Card>
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateHeader
                titleText={intl.formatMessage(messages.statesError)}
                icon={<EmptyStateIcon icon={FrownOpenIcon} color="black"/>}
                headingLevel="h5"
            />
            <EmptyStateBody>
                {message}
            </EmptyStateBody>
        </EmptyState></Card>;

export default Error;

Error.propTypes = {
    message: propTypes.string
};
