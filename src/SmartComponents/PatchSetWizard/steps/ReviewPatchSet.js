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
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';

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
                <TextContent style={{ marginTop: '-15px' }}>
                    <Text component={TextVariants.p}>
                        {intl.formatMessage(
                            messages.textPatchTemplateReview,
                            { b: (...chunks) => <b>{chunks}</b> })}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-u-mt-md pf-u-mb-sm">
                        Template content
                    </Text>
                    <TextList component={TextListVariants.dl}>
                        {renderTextListItem('labelsColumnsUpToDate', processDate(toDate))}
                    </TextList>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-u-mt-md pf-u-mb-sm">
                        Template details
                    </Text>
                    <TextList component={TextListVariants.dl}>
                        {renderTextListItem('labelsColumnsName', name)}
                        {renderTextListItem('labelsDescription', description
                            || intl.formatMessage(messages.titlesTemplateNoDescription))}
                    </TextList>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text component="h2" className="pf-u-mt-md pf-u-mb-sm">
                        Applied to systems
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
