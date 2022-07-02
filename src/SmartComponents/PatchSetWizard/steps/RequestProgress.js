import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    Grid,
    GridItem,
    HelperText,
    HelperTextItem,
    Button
} from '@patternfly/react-core';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InProgressIcon
} from '@patternfly/react-icons';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';

const RequestProgress = ({ onClose, state }) => {
    const { requestPending, failed } = state;

    return (
        <EmptyState
            variant={EmptyStateVariant.large}
            data-component-ouia-id="patch-set-progress"
        >
            <EmptyStateIcon
                color={
                    failed
                        ? 'var(--pf-global--danger-color--100)'
                        : !requestPending
                            ? 'var(--pf-global--success-color--100)'
                            : undefined
                }
                icon={
                    failed
                        ? ExclamationCircleIcon
                        : requestPending
                            ? InProgressIcon
                            : CheckCircleIcon
                }
            />
            <Title headingLevel="h1" size="lg">
                {failed
                    ? intl.formatMessage(messages.textErrorSomethingWrong)
                    : requestPending
                        ? intl.formatMessage(messages.textConfigurationInProgress)
                        : intl.formatMessage(messages.textPatchTemplateSuccessfuly)}
            </Title>
            <EmptyStateBody>
                <Grid hasGutter>
                    {(requestPending) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    {intl.formatMessage(messages.textPatchTemplatePending)}
                                </HelperTextItem>
                            </HelperText>
                        </GridItem><GridItem>
                            <Button variant="link" isInline onClick={onClose}>
                                {intl.formatMessage(messages.labelsCancel)}
                            </Button>{' '}
                        </GridItem></>
                    )}
                    {(!requestPending && !failed) && (
                        <GridItem>
                            <Button variant="primary" onClick={onClose}>
                                {intl.formatMessage(messages.textReturnToApp)}
                            </Button>
                        </GridItem>
                    )}
                    {(!requestPending && failed) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    {intl.formatMessage(messages.templateError, { a: (...chunks) => <a>{chunks}</a> })}
                                </HelperTextItem>
                            </HelperText>
                        </GridItem><GridItem>
                            <Button variant="primary" onClick={onClose}>
                                {intl.formatMessage(messages.textReturnToApp)}
                            </Button>
                        </GridItem></>
                    )}
                </Grid>

            </EmptyStateBody>
        </EmptyState>
    );
};

RequestProgress.propTypes = {
    onClose: propTypes.func,
    state: propTypes.object
};

export default RequestProgress;
