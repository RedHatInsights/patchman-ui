import React, { Fragment } from 'react';
import {
    Text,
    TextContent,
    Stack,
    StackItem,
    TextVariants,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import { templateDateFormat } from '../../../Utilities/Helpers';

const renderTextListItem = (label, text) => (
    <Fragment>
        <TextListItem component={TextListItemVariants.dt} style={{ minWidth: 220 }}>
            {intl.formatMessage(messages[label])}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
            {text}
        </TextListItem>
    </Fragment>
);

const ReviewPatchSet = () => {
    const formOptions = useFormApi();
    const { values } = formOptions.getState();
    const { name, description, toDate } = values.existing_patch_set || values;
    const { systems } = values;

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component="h2">
                        {intl.formatMessage(messages.templateReview)}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent style={{ marginTop: '-15px' }}>
                    <Text component={TextVariants.p}>
                        {intl.formatMessage(messages.textPatchTemplateReview)}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateContent)}
                    </Text>
                    <TextList component={TextListVariants.dl}>
                        {renderTextListItem('labelsColumnsUpToDate', templateDateFormat(toDate))}
                    </TextList>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateDetails)}
                    </Text>
                    <TextList component={TextListVariants.dl}>
                        {renderTextListItem('labelsColumnsName', name)}
                        {renderTextListItem('labelsDescription', description
                            || intl.formatMessage(messages.titlesTemplateNoDescriptionProvided))}
                    </TextList>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateSystems)}
                    </Text>
                    <TextList component={TextListVariants.dl}>
                        {renderTextListItem(
                            'labelsSelectedSystems',
                            intl.formatMessage(messages.labelsSystem, {
                                systemsCount: Object.values(systems).filter(system => system).length
                            })
                        )}
                    </TextList>
                </TextContent>
            </StackItem>
        </Stack>
    );
};

export default ReviewPatchSet;
