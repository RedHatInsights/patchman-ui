import { Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import PackageHeader from '../../PresentationalComponents/PackageHeader/PackageHeader';
import Error from '../../PresentationalComponents/Snippets/Error';
import { paths } from '../../Routes';
import PackageSystems from '../../SmartComponents/PackageSystems/PackageSystems';
import { clearPackageDetailStore, fetchPackageDetails } from '../../store/Actions/Actions';
import { STATUS_LOADING, STATUS_REJECTED } from '../../Utilities/constants';

const PackageDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [packageName] = React.useState(match.params.packageName);
    const packageDetails = useSelector(
        ({ PackageDetailStore }) => PackageDetailStore
    );
    const status = useSelector(
        ({ PackageDetailStore }) => PackageDetailStore.status
    );
    const error = useSelector(
        ({ PackageDetailStore }) => PackageDetailStore.error
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
                breadcrumbs={[
                    {
                        title: 'Patch',
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: 'Packages',
                        to: paths.packages.to,
                        isActive: false
                    },
                    {
                        title: packageName,
                        isActive: true
                    }
                ]}
            >{status === STATUS_REJECTED ? <Error message={error.detail}/> :
                    <PackageHeader
                        attributes={{ ...attributes, id: packageName }}
                        isLoading={status === STATUS_LOADING}
                    />}
            </Header>
            <Main>
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>Affected systems</Text>
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
