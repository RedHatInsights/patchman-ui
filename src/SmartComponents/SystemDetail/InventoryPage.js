import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable,
    SortByDirection
} from '@patternfly/react-table/dist/js';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { getStore, register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';

const InventoryDetail = () => {
    const [InventoryHeader, setInventoryHeader] = React.useState();
    const [InventoryBody, setInventoryBody] = React.useState();

    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithDetail
        } = await insights.loadInventory({
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
            }
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
                breadcrumbs={[
                    {
                        title: 'Patch',
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: 'Systems',
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
