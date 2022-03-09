import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import RemediationModal from '../../SmartComponents/Remediation/RemediationModal';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter, useBulkSelectConfig } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import TableFooter from './TableFooter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';

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
    tableOUIA,
    paginationOUIA,
    errorState,
    emptyState,
    defaultFilters,
    searchChipLabel
}) => {

    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );

    const [deleteFilters] = useRemoveFilter(filter, apply, defaultFilters);
    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;
    const { code, hasError, isLoading } = status;

    return (
        <React.Fragment>
            {
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
                            filters: buildFilterChips(filter, search, searchChipLabel),
                            onDelete: deleteFilters,
                            deleteTitle: intl.formatMessage(defaultFilters
                                && messages.labelsFiltersReset || messages.labelsFiltersClear)
                        }}
                        actionsConfig={{
                            actions: [remediationProvider && (
                                <RemediationModal
                                    remediationProvider={remediationProvider}
                                    isDisabled={
                                        Object.values(selectedRows).filter(isSelected => isSelected).length === 0
                                    } />
                            )]
                        }}
                        exportConfig={{
                            isDisabled: metadata.total_items === 0,
                            onSelect: onExport
                        }}
                        bulkSelect={onSelect && useBulkSelectConfig(selectedCount, onSelect, metadata, rows, onCollapse)}

                    />

                    {isLoading && <SkeletonTable colSize={5} rowSize={20} />
                        || hasError && <ErrorHandler code={code} ErrorState={errorState} EmptyState={emptyState}/>
                        || <React.Fragment>
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
                        </React.Fragment>
                    }
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
    tableOUIA: PropTypes.string,
    paginationOUIA: PropTypes.string,
    errorState: PropTypes.element,
    emptyState: PropTypes.element,
    defaultFilters: PropTypes.object,
    searchChipLabel: PropTypes.string
};

export default TableView;
