import React from 'react';
import propTypes from 'prop-types';
import { PowerOffIcon, SecurityIcon } from '@patternfly/react-icons';
import { intl } from '../../Utilities/IntlProvider';
import { fetchApplicableAdvisoriesApi } from '../../Utilities/api';
import messages from '../../Messages';
import {
    CardTitle, Card, Grid, GridItem, CardBody, Flex, FlexItem, Title
} from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { handlePatchLink, handleLongSynopsis } from '../../Utilities/Helpers';
import { entityTypes, advisorySeverities } from '../../Utilities/constants';
import AdvisoryType from '../AdvisoryType/AdvisoryType';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';

const StatusCard = ({ advisory: { attributes, id } }) =>
    (
        <Card>
            <CardTitle>
                {handlePatchLink(entityTypes.advisories, id)}
            </CardTitle>
            <CardBody className='fonst-size-sm'>
                <Grid>
                    <GridItem span={6}>
                        <Grid>
                            <GridItem>
                                <AdvisoryType
                                    type={attributes.advisory_type}
                                />
                            </GridItem>
                            <GridItem>
                                {processDate(attributes.public_date)}
                            </GridItem>
                            {attributes.os_name && (<GridItem>
                                {attributes.os_name}
                            </GridItem>)}
                        </Grid>
                    </GridItem>
                    <GridItem span={6}>
                        <Grid>
                            {attributes.severity && (<GridItem>
                                <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
                                    <FlexItem>
                                        <SecurityIcon size="sm" color={advisorySeverities[attributes.severity].color} />
                                    </FlexItem>
                                    <FlexItem isFilled>{advisorySeverities[attributes.severity].label}</FlexItem>
                                </Flex>
                            </GridItem>)}
                            {attributes.reboot_required && (<GridItem>
                                <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
                                    <FlexItem><PowerOffIcon color='var(--pf-global--palette--red-100)' /></FlexItem>
                                    <FlexItem isFilled>{intl.formatMessage(messages.textRebootIsRequired)}</FlexItem>
                                </Flex>
                            </GridItem>)}
                        </Grid>
                    </GridItem>
                    <GridItem>
                        {handlePatchLink(
                            entityTypes.advisories,
                            id,
                            intl.formatMessage(
                                messages.labelsApplicableSystemsCount,
                                { systemsCount: attributes.applicable_systems }
                            )
                        )}
                    </GridItem>
                    <GridItem>
                        {handleLongSynopsis(attributes.synopsis)}
                    </GridItem>
                </Grid>
            </CardBody>
        </Card>
    );

const AdvisoriesStatusBar = () => {
    const [advisories, setAdvisories] = React.useState([]);
    React.useEffect(async () => {
        setAdvisories(
            await fetchApplicableAdvisoriesApi({ limit: 4, sort: '-advisory_type,-applicable_systems' })
        );
    }, []);

    return advisories.data && advisories.data.length  && (
        <Main style={{ paddingBottom: 0, paddingTop: 0 }}>

            <Title headingLevel="h3" className='pf-u-my-md'>
                {intl.formatMessage(messages.titlesMostImpactfulAdvisories)}
            </Title>

            <Grid hasGutter span={3}>
                {advisories.data.map(advisory =>
                    (<GridItem key={advisory.id}>
                        <StatusCard
                            advisory={advisory}
                        />
                    </GridItem>)
                )
                }
            </Grid>
        </Main>
    ) || null;
};

StatusCard.propTypes = {
    advisory: propTypes.object
};
export default AdvisoriesStatusBar;
