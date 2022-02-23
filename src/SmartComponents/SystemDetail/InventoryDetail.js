import React, { useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle } from '../../Utilities/Hooks';
import { InventoryDetailHead, AppInfo, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import propTypes from 'prop-types';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';

const InventoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const hasThirdPartyRepo = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.hasThirdPartyRepo
    );
    const entityId = match.params?.inventoryId;
    useEffect(() => {
        dispatch(fetchSystemDetailsAction(entityId));
        return () => {
            dispatch(clearNotifications());
        };
    }, []);

    const pageTitle = entityDetails && `${entityDetails.display_name} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    return (
        <DetailWrapper
            onLoad={({ mergeWithDetail }) => {
                register({
                    ...mergeWithDetail(SystemDetailStore)
                });
            }}
        >
            <Header
                title=""
                headerOUIA={'inventory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchSystems),
                        to: paths.systems.to,
                        isActive: false
                    },
                    entityDetails && {
                        title: entityDetails.display_name,
                        isActive: true
                    }
                ]}
            >
                <InventoryDetailHead hideBack>
                    { hasThirdPartyRepo &&
                        (<Alert className='pf-u-mt-md' isInline variant="info"
                            title={intl.formatMessage(messages.textThirdPartyInfo)}>
                        </Alert>)
                    }
                </InventoryDetailHead>
            </Header>
            <Main>
                <AppInfo />
            </Main>
        </DetailWrapper>
    );
};

InventoryDetail.propTypes = {
    match: propTypes.object
};

export default InventoryDetail;
