import {
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core/dist/js/components/Text/';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/';
import {
    Split,
    SplitItem
} from '@patternfly/react-core/dist/js/layouts/Split/';
import propTypes from 'prop-types';
import React from 'react';
import WithLoader, { WithLoaderVariants } from '../WithLoader/WithLoader';
import './InfoBox.scss';

const InfoBox = ({ title, text, isLoading, content, color }) => {
    return (
        <Split className="infobox" gutter="md">
            <WithLoader
                variant={WithLoaderVariants.skeleton}
                loading={isLoading}
                size="lg"
            >
                <SplitItem style={{ backgroundColor: color }}>
                    <Bullseye>{content}</Bullseye>
                </SplitItem>
                <SplitItem isFilled>
                    <TextContent>
                        <Text component={TextVariants.h6}>{title}</Text>
                        <Text component={TextVariants.p}>{text}</Text>
                    </TextContent>
                </SplitItem>
            </WithLoader>
        </Split>
    );
};

InfoBox.propTypes = {
    title: propTypes.string,
    text: propTypes.any,
    isLoading: propTypes.bool,
    content: propTypes.any,
    color: propTypes.string
};

export default InfoBox;
