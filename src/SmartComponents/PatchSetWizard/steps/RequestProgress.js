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
import ProgressBar from '../../../PresentationalComponents/Snippets/ProgressBar';

const RequestProgress = ({ onClose, state }) => {
    const { percent, failed } = state;

    return (
        <EmptyState
            variant={EmptyStateVariant.large}
            data-component-ouia-id="patch-set-progress"
        >
            <EmptyStateIcon
                color={
                    failed
                        ? 'var(--pf-global--danger-color--100)'
                        : percent === 100
                            ? 'var(--pf-global--success-color--100)'
                            : undefined
                }
                icon={
                    failed
                        ? ExclamationCircleIcon
                        : percent === 100
                            ? CheckCircleIcon
                            : InProgressIcon
                }
            />
            <Title headingLevel="h1" size="lg">
                {failed
                    ? 'Error: Unable to create a patch set'
                    : percent === 100
                        ? 'Patch Set creation successfull'
                        : 'Patch Set creation in progress'}
            </Title>
            <EmptyStateBody>
                <Grid hasGutter>
                    <GridItem>
                        <ProgressBar percent={percent} failed={failed} />
                    </GridItem>
                    {(percent !== 100 && !failed) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    It may take a few minutes to set up a patch set.
                                    You will receive a notification when finished</HelperTextItem>
                            </HelperText>
                        </GridItem><GridItem>
                            <Button variant="link" isInline onClick={onClose}>
                                    Cancel
                            </Button>{' '}
                        </GridItem></>
                    )}
                    {(percent === 100 && !failed) && (
                        <><GridItem>
                            <HelperText>
                                <HelperTextItem variant="indeterminate">
                                    It may take a few minutes to set up a patch set.
                                    You will receive a notification when finished</HelperTextItem>
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
