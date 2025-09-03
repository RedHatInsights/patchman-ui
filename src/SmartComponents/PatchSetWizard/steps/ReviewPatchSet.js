import React, { Fragment } from 'react';
import {
    Content,
    Stack,
    StackItem,
    ContentVariants

} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import { templateDateFormat } from '../../../Utilities/Helpers';

const renderTextListItem = (label, text) => (
    <Fragment>
        <Content component={ContentVariants.dt} style={{ minWidth: 220 }}>
            {intl.formatMessage(messages[label])}
        </Content>
        <Content component={ContentVariants.dd}>
            {text}
        </Content>
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
                <Content>
                    <Content component="h2">
                        {intl.formatMessage(messages.templateReview)}
                    </Content>
                </Content>
            </StackItem>
            <StackItem>
                <Content style={{ marginTop: '-15px' }}>
                    <Content component={ContentVariants.p}>
                        {intl.formatMessage(messages.textPatchTemplateReview)}
                    </Content>
                </Content>
            </StackItem>
            <StackItem>
                <Content>
                    <Content component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateContent)}
                    </Content>
                    <Content component={ContentVariants.dl}>
                        {renderTextListItem('labelsColumnsUpToDate', templateDateFormat(toDate))}
                    </Content>
                </Content>
            </StackItem>
            <StackItem>
                <Content>
                    <Content component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateDetails)}
                    </Content>
                    <Content component={ContentVariants.dl}>
                        {renderTextListItem('labelsColumnsName', name)}
                        {renderTextListItem('labelsDescription', description
                            || intl.formatMessage(messages.titlesTemplateNoDescriptionProvided))}
                    </Content>
                </Content>
            </StackItem>
            <StackItem>
                <Content>
                    <Content component="h2" className="pf-v5-u-mt-md pf-v5-u-mb-sm">
                        {intl.formatMessage(messages.textPatchTemplateSystems)}
                    </Content>
                    <Content component={ContentVariants.dl}>
                        {renderTextListItem(
                            'labelsSelectedSystems',
                            intl.formatMessage(messages.labelsSystem, {
                                systemsCount: Object.values(systems).filter(system => system).length
                            })
                        )}
                    </Content>
                </Content>
            </StackItem>
        </Stack>
    );
};

export default ReviewPatchSet;
