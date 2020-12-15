import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import propTypes from 'prop-types';
import React from 'react';
import WithLoader, { WithLoaderVariants } from '../../PresentationalComponents/WithLoader/WithLoader';
import { getSeverityById, preserveNewlines } from '../../Utilities/Helpers';
import InfoBox from '../InfoBox/InfoBox';
import AdvisorySeverityInfo from '../Snippets/AdvisorySeverityInfo';
import ExternalLink from '../Snippets/ExternalLink';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

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
                                    {intl.formatMessage(messages.labelsPublicDate, { date: processDate(
                                        attributes.public_date
                                    )
                                    })}
                                    <br />
                                </React.Fragment>
                            )}
                            {attributes.modified_date && (
                                <React.Fragment>
                                    {intl.formatMessage(messages.labelsModifiedDate, { date: processDate(
                                        attributes.modified_date
                                    )
                                    })}
                                </React.Fragment>
                            )}
                        </StackItem>
                        <StackItem>
                            <ExternalLink link={`https://access.redhat.com/errata/${attributes.id}`}
                                text={intl.formatMessage(messages.linksViewPackagesAndErrata)} />
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
