import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import { getStore, register } from '../../store';
import {
    changeSystemsListParams,
    fetchSystemsAction
} from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { createSystemsRows } from '../../Utilities/DataMappers';
import {
    getLimitFromPageSize,
    getOffsetFromPageLimit
} from '../../Utilities/Helpers';
import { usePagePerPage } from '../../Utilities/Hooks';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';

const Systems = () => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawSystems = useSelector(
        ({ SystemsListStore }) => SystemsListStore.rows
    );
    const hosts = React.useMemo(() => createSystemsRows(rawSystems), [
        rawSystems
    ]);
    const metadata = useSelector(
        ({ SystemsListStore }) => SystemsListStore.metadata
    );
    const queryParams = useSelector(
        ({ SystemsListStore }) => SystemsListStore.queryParams
    );

    React.useEffect(() => {
        dispatch(fetchSystemsAction(queryParams));
    }, [queryParams]);

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
            ...mergeWithEntities(inventoryEntitiesReducer(systemsListColumns))
        });
        const { InventoryTable } = inventoryConnector(getStore());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    function apply(params) {
        dispatch(changeSystemsListParams(params));
    }

    const handleRefresh = React.useCallback(({ page, per_page: perPage }) => {
        if (metadata.page !== page || metadata.page_size !== perPage) {
            apply({
                offset:
                    metadata.limit !== perPage
                        ? 0
                        : getOffsetFromPageLimit(page, perPage),
                limit: getLimitFromPageSize(perPage)
            });
        }
    });
    return (
        <React.Fragment>
            <Header title={'System Patching'} showTabs />
            <RemediationModalCmp />
            <Main>
                {InventoryCmp && (
                    <InventoryCmp
                        items={hosts}
                        page={page}
                        total={metadata.total_items}
                        perPage={perPage}
                        onRefresh={handleRefresh}
                        hasCheckbox={false}
                        actions={systemsRowActions(showRemediationModal)}
                    />
                )}
            </Main>
        </React.Fragment>
    );
};

export default Systems;
