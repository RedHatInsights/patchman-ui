import { Text, TextContent, TextVariants, Bullseye, Split, SplitItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import WithLoader, { WithLoaderVariants } from '../WithLoader/WithLoader';
import './InfoBox.scss';

const InfoBox = ({ title, text, isLoading, content, color }) => {
    return (
        <Split className="infobox" hasGutter>
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
