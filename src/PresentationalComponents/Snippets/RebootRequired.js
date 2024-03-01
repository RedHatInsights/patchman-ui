
import React from 'react';
import {
    Title, Flex, FlexItem, Icon
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
            <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
                <FlexItem>
                    <Icon size="sm" color={'var(--pf-global--danger-color--100)'}>
                        <PowerOffIcon />
                    </Icon>
                </FlexItem>&nbsp;
                <FlexItem isFilled>{intl.formatMessage(messages.textRebootIsRequired)}</FlexItem>
            </Flex>
        </FlexItem>
    </Flex>
);

export default RebootRequired;
