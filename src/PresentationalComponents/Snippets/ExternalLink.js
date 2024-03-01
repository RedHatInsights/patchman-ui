import { Flex, FlexItem, Icon } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import propTypes from 'prop-types';
import React from 'react';

const ExternalLink = ({ link, text }) => {
    return (
        <a
            href={link}
            target="__blank"
        >
            <Flex flex={{ default: 'inlineFlex' }}>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    {text}
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    <Icon>
                        <ExternalLinkAltIcon />
                    </Icon>
                </FlexItem>
            </Flex>
        </a>

    );
};

ExternalLink.propTypes = {
    link: propTypes.string,
    text: propTypes.string
};

export default ExternalLink;
