import { Card, EmptyState, EmptyStateBody, EmptyStateVariant   } from '@patternfly/react-core';
import { FrownOpenIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const Error = ({ message }) =>
    <Card>
        <EmptyState  headingLevel="h5" icon={FrownOpenIcon}  titleText={intl.formatMessage(messages.statesError)} variant={EmptyStateVariant.full}>
            <EmptyStateBody>
                {message}
            </EmptyStateBody>
        </EmptyState></Card>;

export default Error;

Error.propTypes = {
    message: propTypes.string
};
