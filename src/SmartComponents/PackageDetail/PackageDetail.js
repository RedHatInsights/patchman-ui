import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import PackageHeader from '../../PresentationalComponents/PackageHeader/PackageHeader';
import { Unavailable } from '@redhat-cloud-services/frontend-components';
import { paths } from '../../Routes';
import PackageSystems from '../../SmartComponents/PackageSystems/PackageSystems';
import { clearPackageDetailStore, fetchPackageDetails } from '../../store/Actions/Actions';
import { ENABLE_PACKAGES, STATUS_LOADING, STATUS_REJECTED } from '../../Utilities/constants';
import { setPageTitle } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';

const PackageDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [packageName] = React.useState(match.params.packageName);
    const pageTitle = `${packageName} - ${intl.formatMessage(messages.titlesPackages)}`;
    setPageTitle(pageTitle);
    const packageDetails = useSelector(
        ({ PackageDetailStore }) => PackageDetailStore
    );
    const status = useSelector(
        ({ PackageDetailStore }) => PackageDetailStore.status
    );

    React.useEffect(() => {
        dispatch(fetchPackageDetails({ packageName }));
    }, []);

    React.useEffect(() => {
        return () => {
            //dispatch(clearAdvisorySystemsStore());
            dispatch(clearPackageDetailStore());
        };
    }, []);

    const { attributes } = packageDetails.data;
    return (
        <React.Fragment>
            <Header
                title={packageName}
                headerOUIA={'package-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchPackages),
                        to: ENABLE_PACKAGES && paths.packages.to,
                        isActive: false
                    },
                    {
                        title: packageName,
                        isActive: true
                    }
                ]}
            >{status === STATUS_REJECTED ? <Unavailable/> :
                    <PackageHeader
                        attributes={{ ...attributes, id: packageName }}
                        isLoading={status === STATUS_LOADING}
                    />}
            </Header>
            <Main>
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>{intl.formatMessage(messages.titlesAffectedSystems)}</Text>
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <PackageSystems packageName={packageName}></PackageSystems>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

PackageDetail.propTypes = {
    match: propTypes.any
};

export default withRouter(PackageDetail);
