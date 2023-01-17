import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import PackageHeader from '../../PresentationalComponents/PackageHeader/PackageHeader';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import PackageSystems from '../../SmartComponents/PackageSystems/PackageSystems';
import { clearPackageDetailStore, fetchPackageDetails } from '../../store/Actions/Actions';
import { setPageTitle } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { useParams } from 'react-router-dom';

const PackageDetail = () => {
    const dispatch = useDispatch();
    const { packageName } = useParams();
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
            dispatch(clearNotifications());
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
                        to: '/packages',
                        isActive: false
                    },
                    {
                        title: packageName,
                        isActive: true
                    }
                ]}
            >{status.hasError ? <Unavailable/> :
                    <PackageHeader
                        attributes={{ ...attributes, id: packageName }}
                        isLoading={status.isLoading}
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
                        {status.hasError
                            && < ErrorHandler />
                                || (!status.isLoading && <PackageSystems packageName={packageName}></PackageSystems>)
                        }
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

PackageDetail.propTypes = {
    match: propTypes.any
};

export default PackageDetail;
