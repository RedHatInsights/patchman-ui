import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import propTypes from 'prop-types';
import React from 'react';
import PortalAdvisoryLink from '../../PresentationalComponents/Snippets/PortalAdvisoryLink';
import WithLoader, {
    WithLoaderVariants
} from '../../PresentationalComponents/WithLoader/WithLoader';
import { getSeverityById } from '../../Utilities/Helpers';
import InfoBox from '../InfoBox/InfoBox';

const AdvisoryHeader = ({ attributes, isLoading }) => {
    const severityObject = getSeverityById(attributes.severity);
    return (
        <Grid gutter="sm" style={{ minHeight: 150 }}>
            <GridItem md={8} sm={12}>
                <WithLoader
                    loading={isLoading}
                    variant={WithLoaderVariants.spinner}
                    centered
                >
                    <Stack gutter="sm">
                        <StackItem />
                        <StackItem style={{ whiteSpace: 'pre-line' }}>
                            {attributes.description &&
                                attributes.description.replace(
                                    new RegExp('\\n(?=[^\\n])', 'g'),
                                    ''
                                )}
                        </StackItem>
                        <StackItem>
                            {attributes.public_date && (
                                <React.Fragment>
                                    {`Issued: ${processDate(
                                        attributes.public_date
                                    )}`}
                                    <br />
                                </React.Fragment>
                            )}
                            {attributes.modified_date && (
                                <React.Fragment>
                                    {`Modified: ${processDate(
                                        attributes.modified_date
                                    )}`}
                                </React.Fragment>
                            )}
                        </StackItem>
                        <StackItem>
                            <PortalAdvisoryLink advisory={attributes.id} />
                        </StackItem>
                    </Stack>
                </WithLoader>
            </GridItem>
            <GridItem md={4} sm={12}>
                <InfoBox
                    isLoading={isLoading}
                    title={severityObject.name}
                    color={severityObject.color}
                    text={<a>Learn more</a>}
                    content={<SecurityIcon size="md" />}
                />
            </GridItem>
        </Grid>
    );
};

AdvisoryHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default AdvisoryHeader;
