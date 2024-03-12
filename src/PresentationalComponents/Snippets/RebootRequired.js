
import React from 'react';
import {
    Title, Flex, FlexItem, Icon, Split, SplitItem
} from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { PowerOffIcon } from '@patternfly/react-icons';

const RebootRequired = () =>  (
    <Flex flex={{ default: 'column' }}>
        <FlexItem spacer={{ default: 'spacerNone' }}>
            <Title headingLevel="h6">
                {intl.formatMessage(messages.labelsColumnsReboot)}
            </Title>
        </FlexItem>
        <FlexItem spacer={{ default: 'spacerSm' }}>
            <Split hasGutter>
                <SplitItem>
                    <Icon size="md" status='danger'>
                        <PowerOffIcon />
                    </Icon>
                </SplitItem>
                <SplitItem isFilled>{intl.formatMessage(messages.textRebootIsRequired)}</SplitItem>
            </Split>
        </FlexItem>
    </Flex>
);

export default RebootRequired;
