import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import PatchRemediationButton from '../../SmartComponents/Remediation/PatchRemediationButton';
import RemediationModal from '../../SmartComponents/Remediation/RemediationModal';
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import TableFooter from './TableFooter';

const TableView = ({
    columns,
    store: {
        rows,
        metadata,
        status,
        queryParams: { filter, search }
    },
    onCollapse,
    onSelect,
    onSetPage,
    onPerPageSelect,
    onSort,
    onExport,
    filterConfig,
    sortBy,
    remediationProvider,
    selectedRows,
    compact,
    apply,
    remediationButtonOUIA,
    tableOUIA,
    paginationOUIA,
    errorState,
    emptyState,
    defaultFilters
}) => {
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );

    const [isRemediationLoading, setRemediationLoading] = React.useState(false);

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() => () => <RemediationModal data={resolvedData} />);
        setRemediationLoading(false);
    }

    const [deleteFilters, deleteFilterGroup] = useRemoveFilter(filter, apply, defaultFilters);
    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    return (
        <React.Fragment>
            {
                (status === STATUS_REJECTED) && errorState ||
                (status === STATUS_RESOLVED && emptyState !== false) && emptyState ||
                (<React.Fragment>
                    <PrimaryToolbar
                        pagination={{
                            itemCount: metadata.total_items,
                            page,
                            perPage,
                            isCompact: true,
                            onSetPage,
                            onPerPageSelect,
                            ouiaId: `top-${paginationOUIA}`
                        }}
                        filterConfig={filterConfig}
                        activeFiltersConfig={{
                            filters: buildFilterChips(filter, search),
                            onDelete: deleteFilters,
                            deleteTitle: intl.formatMessage(defaultFilters
                                && messages.labelsFiltersReset || messages.labelsFiltersClear),
                            onDeleteGroup: deleteFilterGroup
                        }}
                        actionsConfig={{
                            actions: [remediationProvider && (
                                <React.Fragment>
                                    <PatchRemediationButton
                                        isDisabled={selectedCount === 0 || isRemediationLoading}
                                        onClick={() =>
                                            showRemediationModal(remediationProvider())
                                        }
                                        ouia={remediationButtonOUIA}
                                        isLoading={isRemediationLoading}
                                    />

                                    <RemediationModalCmp />
                                </React.Fragment>
                            )]
                        }}
                        exportConfig={{
                            isDisabled: metadata.total_items === 0,
                            onSelect: onExport
                        }}
                        bulkSelect={onSelect && {
                            count: selectedCount,
                            items: [{
                                title: intl.formatMessage(messages.labelsBulkSelectNone),
                                onClick: () => {
                                    onSelect('none');
                                }
                            }, {
                                title: intl.formatMessage(messages.labelsBulkSelectPage,
                                    { count: onCollapse && rows.length / 2 || rows.length }
                                ),
                                onClick: () => {
                                    onSelect('page');
                                }
                            },
                            {
                                title: intl.formatMessage(messages.labelsBulkSelectAll, { count: metadata.total_items }),
                                onClick: () => {
                                    onSelect('all');
                                }
                            }],
                            onSelect: () => {
                                selectedCount.length === 0 ? onSelect('all') : onSelect('none');
                            },
                            toggleProps: {
                                'data-ouia-component-type': 'bulk-select-toggle-button'
                            },
                            checked: selectedCount === 0 ? false : selectedCount === metadata.total_items ? true : null,
                            isDisabled: metadata.total_items === 0 && selectedCount === 0
                        }}

                    />

                    {status === STATUS_LOADING && <SkeletonTable colSize={5} rowSize={20} />}
                    {status === STATUS_RESOLVED && (
                        <React.Fragment>
                            <Table
                                aria-label="Patch table view"
                                cells={columns}
                                onSelect={metadata.total_items && onSelect}
                                rows={rows}
                                onCollapse={metadata.total_items && onCollapse}
                                canSelectAll={false}
                                onSort={metadata.total_items && onSort}
                                ouiaId={tableOUIA}
                                sortBy={metadata.total_items && sortBy}
                                isStickyHeader
                                variant={compact && TableVariant.compact}
                            >
                                <TableHeader />
                                <TableBody />
                            </Table>
                            <TableFooter
                                totalItems={metadata.total_items}
                                perPage={perPage}
                                page={page}
                                onSetPage={onSetPage}
                                onPerPageSelect={onPerPageSelect}
                                paginationOUIA={`bottom-${paginationOUIA}`}
                            />
                        </React.Fragment>)}
                </React.Fragment>)
            }
        </React.Fragment>
    );
};

TableView.propTypes = {
    columns: PropTypes.array,
    onCollapse: PropTypes.func,
    onSelect: PropTypes.func,
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    onSort: PropTypes.func,
    onExport: PropTypes.func,
    remediationProvider: PropTypes.func,
    selectedRows: PropTypes.object,
    apply: PropTypes.func,
    sortBy: PropTypes.object,
    filterConfig: PropTypes.object,
    store: PropTypes.object,
    compact: PropTypes.bool,
    remediationButtonOUIA: PropTypes.string,
    tableOUIA: PropTypes.string,
    paginationOUIA: PropTypes.string,
    errorState: PropTypes.any,
    emptyState: PropTypes.any,
    defaultFilters: PropTypes.object
};

export default TableView;
