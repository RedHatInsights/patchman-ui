/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import { getStore, register } from '../../store';
import { fetchSystemsAction } from '../../store/Actions/Actions';

const Systems = () => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const hosts = useSelector(({ SystemsListStore }) => SystemsListStore.rows);

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
        const { InventoryTable } = inventoryConnector(getStore());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);
    React.useEffect(() => {
        dispatch(fetchSystemsAction());
    }, []);

    console.log(hosts);

    return (
        <React.Fragment>
            <Header title={'System Patching'} showTabs />
            <Main>{InventoryCmp && <InventoryCmp items={hosts} />}</Main>
        </React.Fragment>
    );
};

export default Systems;
