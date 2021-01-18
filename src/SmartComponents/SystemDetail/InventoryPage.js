import React from 'react';
import { Main } from '@redhat-cloud-services/frontend-components';
import { useSelector } from 'react-redux';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle } from '../../Utilities/Hooks';
import { InventoryDetailHead, AppInfo } from '@redhat-cloud-services/frontend-components/components/cjs/Inventory';

const InventoryDetail = () => {
    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const pageTitle = entityDetails && `${entityDetails.display_name} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    return (
        <React.Fragment>
            <Header
                onLoad={({ mergeWithDetail }) => {
                    register({
                        ...mergeWithDetail(SystemDetailStore)
                    });
                }}
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
                {<InventoryDetailHead hideBack />}
            </Header>
            <Main>
                <AppInfo />
            </Main>
        </React.Fragment>
    );
};

export default InventoryDetail;
