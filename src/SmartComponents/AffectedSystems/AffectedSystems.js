import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import propTypes from 'prop-types';
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
    arrayFromObj,
    getLimitFromPageSize,
    getOffsetFromPageLimit,
    remediationProvider
} from '../../Utilities/Helpers';
import { usePagePerPage } from '../../Utilities/Hooks';
import RemediationModal from '../Remediation/RemediationModal';
import {
    systemsListColumns,
    systemsRowActions
} from '../Systems/SystemsListAssets';

const AffectedSystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawAffectedSystems = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.rows
    );
    const selectedRows = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.selectedRows
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

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    function apply(params) {
        dispatch(changeAffectedSystemsParams(params));
    }

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const handleRefresh = React.useCallback(({ page, per_page: perPage }) => {
        const offset = getOffsetFromPageLimit(page, perPage);
        const limit = getLimitFromPageSize(perPage);
        apply({
            ...(metadata.offset !== offset && { offset }),
            ...(metadata.limit !== limit && { limit })
        });
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
                    actions={systemsRowActions(showRemediationModal)}
                >
                    <reactCore.ToolbarGroup>
                        <reactCore.ToolbarItem>
                            <reactCore.Button
                                isDisabled={
                                    arrayFromObj(selectedRows).length === 0
                                }
                                onClick={() =>
                                    showRemediationModal(
                                        remediationProvider(
                                            advisoryName,
                                            arrayFromObj(selectedRows)
                                        )
                                    )
                                }
                            >
                                Apply
                            </reactCore.Button>
                            <RemediationModalCmp />
                        </reactCore.ToolbarItem>
                    </reactCore.ToolbarGroup>
                </InventoryCmp>
            )}
        </React.Fragment>
    );
};

AffectedSystems.propTypes = {
    advisoryName: propTypes.string
};

export default AffectedSystems;
