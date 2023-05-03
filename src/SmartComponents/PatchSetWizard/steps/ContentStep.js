import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
    Text,
    TextContent,
    Stack,
    StackItem,
    ExpandableSection
} from '@patternfly/react-core';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import { convertIsoToDate } from '../../../Utilities/Helpers';
import { toDateComponent } from '../WizardAssets';

const ContentStep = ({ patchSetID }) => {
    const formOptions = useFormApi();

    const { patchSet, status } = useSelector(({ SpecificPatchSetReducer }) => SpecificPatchSetReducer, shallowEqual);

    useEffect(() => {
        if (patchSetID) {
            const { config: { to_time: toDate }, name: previousName } = patchSet;

            formOptions.change('toDate', convertIsoToDate(toDate));
            formOptions.change('previousName', previousName);
            formOptions.change('templateDetailLoading', status.isLoading);
        }
    }, [patchSet, status]);

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component="h2">
                        {intl.formatMessage(messages.templateContentStepTitle)}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                {intl.formatMessage(messages.templateContentStepText)}
            </StackItem>

            <StackItem>
                {formOptions.renderForm(toDateComponent)}
            </StackItem>

            <StackItem>
                <ExpandableSection toggleText={intl.formatMessage(messages.templateContentStepExpandableTitle)}>
                    {intl.formatMessage(messages.templateContentStepExpandable)}
                </ExpandableSection>
            </StackItem>
        </Stack>
    );
};

ContentStep.propTypes = {
    patchSetID: propTypes.string
};
export default ContentStep;
