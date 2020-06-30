import { cellWidth, expandable, sortable, SortByDirection, Table as PfTable, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table/dist/js';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useSelector } from 'react-redux';
import * as ReactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/files/inventoryDependencies';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { getStore, register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';

const InventoryDetail = () => {
    const [InventoryHeader, setInventoryHeader] = React.useState();
    const [InventoryBody, setInventoryBody] = React.useState();
    const [InventoryWrapper, setInventoryWrapper] = React.useState();

    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

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

        const { InventoryDetailHead, AppInfo, DetailWrapper } = inventoryConnector(getStore());
        setInventoryHeader(() => InventoryDetailHead);
        setInventoryBody(() => AppInfo);
        setInventoryWrapper(() => DetailWrapper);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    const Wrapper = InventoryWrapper || React.Fragment;
    return (
        <Wrapper>
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
        </Wrapper>
    );
};

export default InventoryDetail;
