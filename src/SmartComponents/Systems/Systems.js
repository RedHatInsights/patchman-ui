import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { getStore, register } from '../../store';
import { changeSystemsListParams, fetchSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { STATUS_REJECTED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { buildFilterChips } from '../../Utilities/Helpers';
import { useHandleRefresh, usePagePerPage, useRemoveFilter } from '../../Utilities/Hooks';
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
    const error = useSelector(
        ({ SystemsListStore }) => SystemsListStore.error
    );
    const status = useSelector(
        ({ SystemsListStore }) => SystemsListStore.status
    );
    const metadata = useSelector(
        ({ SystemsListStore }) => SystemsListStore.metadata
    );
    const queryParams = useSelector(
        ({ SystemsListStore }) => SystemsListStore.queryParams
    );

    const { filter, search } = queryParams;

    const handleRefresh = useHandleRefresh(metadata, apply);

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

    const removeFilter = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search, 'Search systems')
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: removeFilter
    };

    return (
        <React.Fragment>

            <Header title={'Patch'} showTabs />
            <RemediationModalCmp />
            <Main>
                {status === STATUS_REJECTED ? <Error message={error.detail}/> :
                    InventoryCmp && (
                        <InventoryCmp
                            items={hosts}
                            page={page}
                            total={metadata.total_items}
                            perPage={perPage}
                            onRefresh={handleRefresh}
                            hasCheckbox={false}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}

                        />
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
