/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import { getStore, register } from '../../store';
import {
    changeAffectedSystemsParams,
    fetchAffectedSystemsAction
} from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { createSystemsRows } from '../../Utilities/DataMappers';
import {
    convertLimitOffset,
    getLimitFromPageSize,
    getOffsetFromPageLimit
} from '../../Utilities/Helpers';
import { systemsListColumns } from '../Systems/SystemsListAssets';

const AffectedSystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const rawAffectedSystems = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.rows
    );
    const hosts = React.useMemo(() => createSystemsRows(rawAffectedSystems), [
        rawAffectedSystems
    ]);
    const metadata = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.metadata
    );
    const queryParams = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.queryParams
    );

    React.useEffect(() => {
        dispatch(
            fetchAffectedSystemsAction({ id: advisoryName, ...queryParams })
        );
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

    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );

    function apply(params) {
        dispatch(changeAffectedSystemsParams(params));
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
            {InventoryCmp && (
                <InventoryCmp
                    items={hosts}
                    page={page}
                    total={metadata.total_items}
                    perPage={perPage}
                    onRefresh={handleRefresh}
                />
            )}
        </React.Fragment>
    );
};

export default AffectedSystems;
