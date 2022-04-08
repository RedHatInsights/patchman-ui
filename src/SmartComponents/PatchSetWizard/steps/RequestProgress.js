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
                    ? 'Something went wrong'
                    : requestPending
                        ? 'Configuration in progress'
                        : 'Patch set configuration successful'}
            </Title>
            <EmptyStateBody>
                <Grid hasGutter>
                    {(requestPending) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    Please allow a few minutes to set up a patch set.
                                    You will receive a notification when finished</HelperTextItem>
                            </HelperText>
                        </GridItem><GridItem>
                            <Button variant="link" isInline onClick={onClose}>
                                    Cancel
                            </Button>{' '}
                        </GridItem></>
                    )}
                    {(!requestPending && !failed) && (
                        <GridItem>
                            <Button variant="primary" onClick={onClose}>Return to application</Button>
                        </GridItem>
                    )}
                    {(!requestPending && failed) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    There was a problem processing the patch set. Please try again. If the problem
                                    persists, contact <a href='https://www.redhat.com/en/services/support'>Red Hat support</a>
                                </HelperTextItem>
                            </HelperText>
                        </GridItem><GridItem>
                            <Button variant="primary" onClick={onClose}>Return to application</Button>
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
