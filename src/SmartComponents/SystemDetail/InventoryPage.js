import { cellWidth, expandable, sortable, SortByDirection,
    Table as PfTable, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { useSelector } from 'react-redux';
import * as ReactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/files/inventoryDependencies';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { getStore, register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle } from '../../Utilities/Hooks';

const InventoryDetail = () => {
    const [InventoryHeader, setInventoryHeader] = React.useState();
    const [InventoryBody, setInventoryBody] = React.useState();

    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const pageTitle = entityDetails && `${entityDetails.display_name} - ${intl.formatMessage(messages.systems)}`;
    setPageTitle(pageTitle);

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithDetail
        } = await insights.loadInventory({
            ReactRedux,
            React,
            reactRouterDom,
            pfReactTable: {
                Table: PfTable,
                TableBody,
                TableHeader,
                TableGridBreakpoint,
                cellWidth,
                TableVariant,
                sortable,
                expandable,
                SortByDirection
            },
            pfReact: reactCore
        });

        register({
            ...mergeWithDetail(SystemDetailStore)
        });

        const { InventoryDetailHead, AppInfo } = inventoryConnector(getStore());
        setInventoryHeader(() => InventoryDetailHead);
        setInventoryBody(() => AppInfo);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <React.Fragment>
            <Header
                title=""
                headerOUIA={'inventory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.pageTitlesSystems),
                        to: paths.systems.to,
                        isActive: false
                    },
                    entityDetails && {
                        title: entityDetails.display_name,
                        isActive: true
                    }
                ]}
            >
                {InventoryHeader && <InventoryHeader hideBack />}
            </Header>
            {InventoryBody && (
                <Main>
                    <InventoryBody />
                </Main>
            )}
        </React.Fragment>
    );
};

export default InventoryDetail;
