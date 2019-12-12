/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { connect, Provider } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import { getStore, register } from '../../store';

const Systems = () => {
    const [InventoryCmp, setInventoryCmp] = React.useState();

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithEntities
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        register({
            ...mergeWithEntities()
        });
        const { InventoryTable } = inventoryConnector();
        console.log(inventoryConnector());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    console.log(<InventoryCmp />);

    return (
        <React.Fragment>
            <Header title={'System Patching'} showTabs />
            <Main>
                <Provider store={getStore()}>
                    {InventoryCmp && <InventoryCmp store={getStore()} />}
                </Provider>
            </Main>
        </React.Fragment>
    );
};

export default connect(() => ({}))(Systems);
