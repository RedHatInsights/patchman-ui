import { CheckCircleIcon, PackageIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import {
    CardTitle, Button, Skeleton,
    Card, Grid, GridItem, CardBody, Flex, FlexItem
} from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';

const StatusCard = ({ title, color, Icon, value, filter, apply }) => {
    return (
        <Card isCompact style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
            <CardTitle style={{ marginTop: '0px' }}>{title}</CardTitle>
            <CardBody className='fonst-size-sm'>
                <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
                    <FlexItem
                        spacer={{ default: 'spacerMd' }}
                        alignSelf={{ default: 'alignSelfCenter' }}
                    >
                        <Icon color={color} size='md'/>
                    </FlexItem>
                    <FlexItem isFilled spacer={{ default: 'spacerNone' }}>
                        {
                            typeof(value) === 'undefined'
                            &&  <Skeleton width="24px" />
                                    ||  <Button
                                        variant="link"
                                        onClick={() => apply(filter)}
                                        className='patch-status-report-text'>
                                        {value}
                                    </Button>
                        }
                    </FlexItem>
                </Flex>
            </CardBody>
        </Card>
    );
};

const SystemsStatusreport = ({ metadata: { subtotals }, apply }) => (
    <Main style={{ paddingBottom: 0 }}>

        <Grid hasGutter span={3}>
            <GridItem>
                <StatusCard
                    title={intl.formatMessage(messages.labelsStatusSystemsUpToDate)}
                    Icon={CheckCircleIcon}
                    color={'var(--pf-global--success-color--100)'}
                    value={subtotals?.patched}
                    apply={apply}
                    filter={{ filter: { packages_updatable: 'eq:0' } }}
                />
            </GridItem>
            <GridItem>
                <StatusCard
                    title={intl.formatMessage(messages.labelsStatusSystemsWithPatchesAvailable)}
                    Icon={PackageIcon}
                    color={'var(--pf-global--primary-color--100)'}
                    value={subtotals?.unpatched}
                    apply={apply}
                    filter={{ filter: { packages_updatable: 'gt:0' } }}
                />
            </GridItem>
            <GridItem>
                <StatusCard
                    title={intl.formatMessage(messages.labelsStatusStaleSystems)}
                    Icon={ExclamationTriangleIcon}
                    color={'var(--pf-global--warning-color--100)'}
                    value={subtotals?.stale}
                    apply={apply}
                    filter={{ filter: { stale: true } }}
                />
            </GridItem>
        </Grid>
    </Main>
);

StatusCard.propTypes = {
    title: propTypes.string,
    Icon: propTypes.elementType,
    value: propTypes.string,
    color: propTypes.string,
    apply: propTypes.func,
    filter: propTypes.object
};

SystemsStatusreport.propTypes = {
    metadata: propTypes.object,
    apply: propTypes.func
};

export default SystemsStatusreport;
