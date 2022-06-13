import React from 'react';
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
                        Review the information below and click <b>Submit</b> to complete patch set creation
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <TextContent>
                    <TextList component={TextListVariants.dl}>
                        <TextListItem component={TextListItemVariants.dt}>Name:</TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>{name}</TextListItem>
                        {description && (<>
                            <TextListItem component={TextListItemVariants.dt}>Description:</TextListItem>
                            <TextListItem component={TextListItemVariants.dd}>{description}</TextListItem>
                        </>)}
                        {toDate && (<>
                            <TextListItem component={TextListItemVariants.dt}>Date:</TextListItem>
                            <TextListItem component={TextListItemVariants.dd}>{toDate}</TextListItem>
                        </>)}
                        <TextListItem component={TextListItemVariants.dt}>Selected systems:</TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                            {systems && Object.values(systems).filter(system => system).length}
                        </TextListItem>
                    </TextList>
                </TextContent>
            </StackItem>
        </Stack>
    );
};

export default ReviewPatchSet;
