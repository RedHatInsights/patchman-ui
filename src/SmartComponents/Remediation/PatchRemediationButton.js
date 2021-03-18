import { Button, Flex, FlexItem, Spinner } from '@patternfly/react-core';
import { AnsibleTowerIcon } from '@patternfly/react-icons';
import globalPaletteWhite from '@patternfly/react-tokens/dist/js/global_palette_white';
import propTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

const PatchRemediationButton = ({ onClick, isDisabled, isLoading, ouia }) => {
    return (
        <Button
            isDisabled={isDisabled}
            className={'remediationButtonPatch'}
            onClick={onClick}
            ouiaId={ouia}
        ><Flex flex={{ default: 'inlineFlex' }}
                alignItems={{ default: 'alignItemsCenter' }}
                justifyContent={{ default: 'justifyContentCenter' }}>
                <FlexItem spacer={{ default: 'spacerXs' }} style={{ display: 'flex' }}>
                    {isLoading &&
                                                <Spinner isSVG size='md'/>
                                     || <AnsibleTowerIcon color={globalPaletteWhite.value}/>}
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerXs' }} style={{ display: 'flex' }}>
                                     &nbsp;{intl.formatMessage(messages.labelsRemediate)}
                </FlexItem>
            </Flex>
        </Button>
    );
};

PatchRemediationButton.propTypes = {
    onClick: propTypes.object,
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool,
    ouia: propTypes.string
};

export default PatchRemediationButton;
