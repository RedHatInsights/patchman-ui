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
import { InventoryDetailHead, AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import { Label } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import propTypes from 'prop-types';

const InventoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const hasThirdPartyRepo = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.hasThirdPartyRepo
    );
    const entityId = match.params?.inventoryId;
    useEffect(() => { dispatch(fetchSystemDetailsAction(entityId)); }, []);

    const pageTitle = entityDetails && `${entityDetails.display_name} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    return (
        <React.Fragment>
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
                <InventoryDetailHead
                    onLoad={({ mergeWithDetail }) => {
                        console.log('Inventory on load');
                        register({
                            ...mergeWithDetail(SystemDetailStore)
                        });
                    }} hideBack
                >
                    { hasThirdPartyRepo &&
                        (<Label color="purple">{intl.formatMessage(messages.textThirdPartyInfo)}</Label>)
                    }
                </InventoryDetailHead>
            </Header>
            <Main>
                <AppInfo />
            </Main>
        </React.Fragment>
    );
};

InventoryDetail.propTypes = {
    match: propTypes.object
};

export default InventoryDetail;
