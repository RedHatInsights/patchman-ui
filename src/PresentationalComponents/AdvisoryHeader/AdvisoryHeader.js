import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/js/layouts/Stack/StackItem';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import propTypes from 'prop-types';
import React from 'react';
import WithLoader, { WithLoaderVariants } from '../../PresentationalComponents/WithLoader/WithLoader';
import { getSeverityById, preserveNewlines } from '../../Utilities/Helpers';
import InfoBox from '../InfoBox/InfoBox';
import AdvisorySeverityInfo from '../Snippets/AdvisorySeverityInfo';
import ExternalLink from '../Snippets/ExternalLink';

const AdvisoryHeader = ({ attributes, isLoading }) => {
    const severityObject = getSeverityById(attributes.severity);
    return (
        <Grid hasGutter style={{ minHeight: 150 }}>
            <GridItem md={8} sm={12}>
                <WithLoader
                    loading={isLoading}
                    variant={WithLoaderVariants.spinner}
                    centered
                >
                    <Stack hasGutter>
                        <StackItem />
                        <StackItem style={{ whiteSpace: 'pre-line' }}>
                            {
                                preserveNewlines(attributes.description)
                            }
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
                            <ExternalLink link={`https://access.redhat.com/errata/${attributes.id}`}
                                text={'View packages and errata at access.redhat.com'} />
                        </StackItem>
                    </Stack>
                </WithLoader>
            </GridItem>
            <GridItem md={4} sm={12}>
                {severityObject.value !== 0 && (
                    <InfoBox
                        isLoading={isLoading}
                        title={severityObject.label}
                        color={severityObject.color}
                        text={
                            <AdvisorySeverityInfo severity={severityObject} />
                        }
                        content={<SecurityIcon size="lg" />}
                    />
                )}
            </GridItem>
        </Grid>
    );
};

AdvisoryHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default AdvisoryHeader;
