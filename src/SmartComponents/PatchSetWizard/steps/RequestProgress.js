import React from 'react';
import propTypes from 'prop-types';
import {
    EmptyState,
    EmptyStateVariant,
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
import { useDispatch } from 'react-redux';
import { apiFailedNotification } from '../WizardAssets';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const RequestProgress = ({ onClose, state }) => {
    const { requestPending, failed, error } = state;
    const dispatch = useDispatch();

    if (failed) {
        dispatch(
            addNotification(
                apiFailedNotification(error.detail)
            )
        );
    }

    return (
        <EmptyState  headingLevel="h1" icon={
            failed
                ? ExclamationCircleIcon
                : requestPending
                    ? InProgressIcon
                    : CheckCircleIcon
        }  titleText={failed
            ? intl.formatMessage(messages.textErrorSomethingWrong)
            : requestPending
                ? intl.formatMessage(messages.textConfigurationInProgress)
                : intl.formatMessage(messages.textPatchTemplateSuccessfuly)}
        variant={EmptyStateVariant.lg}
        data-component-ouia-id="patch-set-progress"
        >
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
                                    {intl.formatMessage(
                                        messages.templateError,
                                        { a: (chunks) => <a href="https://www.redhat.com/en/services/support">{chunks}</a> })}
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
