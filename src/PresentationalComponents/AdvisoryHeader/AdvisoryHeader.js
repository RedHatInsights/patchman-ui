import {
    Button, Grid, GridItem, Stack, StackItem, Text, TextContent,
    FlexItem, TextVariants, Flex
} from '@patternfly/react-core';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import propTypes from 'prop-types';
import React, { useState } from 'react';
import messages from '../../Messages';
import WithLoader, { WithLoaderVariants } from '../../PresentationalComponents/WithLoader/WithLoader';
import CvesModal from '../../SmartComponents/AdvisoryDetail/CvesModal';
import { getSeverityById, isRHAdvisory, preserveNewlines } from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import RebootRequired from '../Snippets/RebootRequired';
import AdvisorySeverityInfo from '../Snippets/AdvisorySeverityInfo';
import ExternalLink from '../Snippets/ExternalLink';

const AdvisoryHeader = ({ attributes, isLoading }) => {
    const [CvesInfoModal, setCvesModal] = useState(() => () => null);
    const severityObject = getSeverityById(attributes.severity);
    const cves = attributes.cves;

    const showCvesModal = () => {
        setCvesModal(() => () => <CvesModal cveIds={cves} />);
    };

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
                                    {intl.formatMessage(messages.labelsPublicDate, {
                                        date: processDate(
                                            attributes.public_date
                                        )
                                    })}
                                    <br />
                                </React.Fragment>
                            )}
                            {attributes.modified_date && (
                                <React.Fragment>
                                    {intl.formatMessage(messages.labelsModifiedDate, {
                                        date: processDate(
                                            attributes.modified_date
                                        )
                                    })}
                                </React.Fragment>
                            )}
                        </StackItem>
                        {isRHAdvisory(attributes.id) &&
                            <StackItem>
                                <ExternalLink link={`https://access.redhat.com/errata/${attributes.id}`}
                                    text={intl.formatMessage(messages.linksViewPackagesAndErrata)} />
                            </StackItem>
                        }
                    </Stack>
                </WithLoader>
            </GridItem>
            <GridItem md={4} sm={12}>
                <Flex flex={{ default: 'column' }}>
                    {severityObject.value !== 0 && (<FlexItem>
                        <AdvisorySeverityInfo severity={severityObject}/>
                    </FlexItem>
                    )}

                    {attributes.reboot_required && (<FlexItem spacer={{ default: 'spacerMd' }}>
                        <RebootRequired />
                    </FlexItem>)}
                </Flex>
            </GridItem>
            {cves && cves.length !== 0 && (
                <GridItem md={4} sm={12}>
                    <TextContent>
                        <Text component={TextVariants.h3}>
                            {intl.formatMessage(messages.labelsCves)}
                        </Text>
                        <Button variant='link' style={{ padding: 0 }} onClick={showCvesModal} >
                            {intl.formatMessage(messages.labelsCvesButton, { cvesCount: cves.length })}
                        </Button>
                    </TextContent>
                </GridItem>
            )}
            <CvesInfoModal />
        </Grid>
    );
};

AdvisoryHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default AdvisoryHeader;
