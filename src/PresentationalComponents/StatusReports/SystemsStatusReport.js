import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircleIcon, PackageIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import {
    CardTitle,
    Button,
    Skeleton,
    Card,
    Grid,
    GridItem,
    CardBody,
    Flex,
    FlexItem,
    Icon as PfIcon
} from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { fetchSystems } from '../../Utilities/api';

const StatusCard = ({ title, color, Icon, value, filter, apply }) => {
    return (
        <Card isCompact isFullHeight>
            <CardTitle style={{ marginTop: '0px' }}>{title}</CardTitle>
            <CardBody className='fonst-size-sm'>
                <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
                    <FlexItem
                        spacer={{ default: 'spacerMd' }}
                        alignSelf={{ default: 'alignSelfCenter' }}
                    >
                        <PfIcon size='md'>
                            <Icon color={color} />
                        </PfIcon>
                    </FlexItem>
                    <FlexItem spacer={{ default: 'spacerNone' }}>
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

const SystemsStatusReport = ({ apply, queryParams }) => {
    const [subtotals, setSubtotals] = React.useState({});

    const { selectedTags, selectedGlobalTags, systemProfile } = useSelector(({ GlobalFilterStore }) => GlobalFilterStore);

    const fetchResource = () => {
        setSubtotals({});

        let result;

        try {
            result = fetchSystems({
                filter: {
                    os: queryParams?.filter?.os
                },
                selectedTags: [...selectedTags, ...selectedGlobalTags],
                systemProfile,
                limit: 1,
                'filter[stale]': 'in:true,false'
            }).then((result)=> {
                setSubtotals(result.meta?.subtotals);
            });
        }
        catch {
            result = [];
        }

        return result;
    };

    React.useEffect(() => {
        fetchResource();
    }, [
        queryParams?.filter?.os?.length, queryParams?.filter?.os !== undefined,
        selectedTags?.length, selectedTags !== undefined,
        selectedGlobalTags?.length, selectedGlobalTags !== undefined,
        systemProfile,
        queryParams?.subtotals !== undefined
    ]);

    return (
        <Main style={{ paddingBottom: 0 }}>
            <Grid hasGutter span={12} >
                <GridItem lg={3} md={4}>
                    <StatusCard
                        title={intl.formatMessage(messages.labelsStatusSystemsUpToDate)}
                        Icon={CheckCircleIcon}
                        color={'var(--pf-v5-global--success-color--100)'}
                        value={subtotals?.patched}
                        apply={apply}
                        filter={{ filter: { packages_updatable: 'eq:0' } }}
                    />
                </GridItem>
                <GridItem lg={3} md={4}>
                    <StatusCard
                        title={intl.formatMessage(messages.labelsStatusSystemsWithPatchesAvailable)}
                        Icon={PackageIcon}
                        color={'var(--pf-v5-global--primary-color--100)'}
                        value={subtotals?.unpatched}
                        apply={apply}
                        filter={{ filter: { packages_updatable: 'gt:0' } }}
                    />
                </GridItem>
                <GridItem lg={3} md={4}>
                    <StatusCard
                        title={intl.formatMessage(messages.labelsStatusStaleSystems)}
                        Icon={ExclamationTriangleIcon}
                        color={'var(--pf-v5-global--warning-color--100)'}
                        value={subtotals?.stale}
                        apply={apply}
                        filter={{ filter: { stale: true } }}
                    />
                </GridItem>
            </Grid>
        </Main>
    );
};

StatusCard.propTypes = {
    title: propTypes.string,
    Icon: propTypes.elementType,
    value: propTypes.number,
    color: propTypes.string,
    apply: propTypes.func,
    filter: propTypes.object
};

SystemsStatusReport.propTypes = {
    apply: propTypes.func,
    queryParams: propTypes.object
};

export default SystemsStatusReport;
